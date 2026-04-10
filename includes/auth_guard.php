<?php
// ============================================================
// FreeGeny — Auth Guard
// À inclure en tête des pages protégées
// Usage : require_once ROOT_PATH . '/includes/auth_guard.php';
// ============================================================

require_once ROOT_PATH . '/config/app.php';
initSession();

/**
 * Vérifie si l'utilisateur est connecté via la session.
 */
function isLoggedIn(): bool {
    return !empty($_SESSION['user']['id']);
}

/**
 * Retourne les données de l'utilisateur en session.
 */
function currentUser(): ?array {
    return $_SESSION['user'] ?? null;
}

/**
 * Redirige vers /auth/login si non connecté.
 */
function requireLogin(string $redirect = ''): void {
    if (!isLoggedIn()) {
        $url = APP_URL . '/auth/login';
        if ($redirect) {
            $url .= '?redirect=' . urlencode($redirect);
        }
        redirect($url);
    }
}

/**
 * Redirige vers /dashboard/parent si déjà connecté.
 * (Utile pour login/register pages)
 */
function requireGuest(): void {
    if (isLoggedIn()) {
        redirect(APP_URL . '/dashboard/parent');
    }
}

/**
 * Vérifie si l'utilisateur a un abonnement actif.
 */
function hasActiveSubscription(): bool {
    $user = currentUser();
    if (!$user) return false;
    if ($user['subscription_status'] !== 'active') return false;
    if (empty($user['subscription_expires_at'])) return false;
    return strtotime($user['subscription_expires_at']) > time();
}

/**
 * Valide un token CSRF depuis POST.
 */
function validateCsrfOrFail(): void {
    $token = $_POST[CSRF_TOKEN_NAME] ?? '';
    if (!verifyCsrfToken($token)) {
        http_response_code(403);
        die(json_encode(['error' => 'Token CSRF invalide.']));
    }
}

/**
 * Crée ou met à jour la session utilisateur depuis la BDD.
 */
function loginUser(array $user): void {
    // Régénérer l'ID de session pour prévenir la fixation
    session_regenerate_id(true);
    $_SESSION['user'] = [
        'id'                   => $user['id'],
        'email'                => $user['email'],
        'full_name'            => $user['full_name'],
        'avatar'               => $user['avatar'],
        'declared_country'     => $user['declared_country'],
        'country_verified'     => (bool)$user['country_verified'],
        'subscription_status'  => $user['subscription_status'],
        'subscription_expires_at' => $user['subscription_expires_at'],
    ];
    $_SESSION['created'] = time();
}

/**
 * Déconnecte l'utilisateur.
 */
function logoutUser(): void {
    session_unset();
    session_destroy();
    // Supprimer le cookie de session
    setcookie(session_name(), '', time() - 3600, '/', 'freegeny.com', true, true);
}
