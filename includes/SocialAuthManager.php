<?php
/**
 * SocialAuthManager - Gère l'identité unifiée (Reconnaissance multi-réseaux)
 * Point 1 du plan d'amélioration
 */

class SocialAuthManager {
    private $db;

    public function __construct($pdo) {
        $this->db = $pdo;
    }

    /**
     * Gère la connexion ou l'inscription d'un utilisateur venant d'un réseau social
     * 
     * @param string $provider Le nom du réseau (google, facebook, etc.)
     * @param string $provider_id L'ID unique envoyé par le réseau
     * @param string $email L'email de l'utilisateur
     * @param string $full_name Le nom de l'utilisateur
     * @return int|bool L'ID de l'utilisateur ou false en cas d'erreur
     */
    public function handleSocialUser($provider, $provider_id, $email, $full_name) {
        // 1. Chercher si ce compte social est déjà lié
        $stmt = $this->db->prepare("SELECT user_id FROM user_social_accounts WHERE provider = ? AND provider_id = ?");
        $stmt->execute([$provider, $provider_id]);
        $existingSocial = $stmt->fetch();

        if ($existingSocial) {
            return $existingSocial['user_id'];
        }

        // 2. Si le lien n'existe pas, chercher l'utilisateur par son EMAIL (Reconnaissance automatique)
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            // L'utilisateur existe déjà (par ex via un autre réseau), on lie le nouveau provider
            $user_id = $user['id'];
            $this->linkSocialAccount($user_id, $provider, $provider_id);
            return $user_id;
        }

        // 3. Sinon, on crée un nouvel utilisateur (Premier enregistrement)
        $user_id = $this->createNewUser($email, $full_name);
        if ($user_id) {
            $this->linkSocialAccount($user_id, $provider, $provider_id);
            return $user_id;
        }

        return false;
    }

    private function linkSocialAccount($user_id, $provider, $provider_id) {
        $stmt = $this->db->prepare("INSERT INTO user_social_accounts (user_id, provider, provider_id) VALUES (?, ?, ?)");
        return $stmt->execute([$user_id, $provider, $provider_id]);
    }

    private function createNewUser($email, $full_name) {
        $stmt = $this->db->prepare("INSERT INTO users (email, full_name, role) VALUES (?, ?, 'parent')");
        if ($stmt->execute([$email, $full_name])) {
            return $this->db->lastInsertId();
        }
        return false;
    }
}
