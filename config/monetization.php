<?php
// ============================================================
// FreeGeny — Logique Monétisation par Pays
// Portée depuis le middleware Next.js vers PHP
// ============================================================

// Pays avec accès GRATUIT + publicités
const PAYS_FREE_ADS = [
    'DZ','MA','TN','EG','LY','SY',
    'SN','CI','NG','KE','SD','ML',
    'BF','NE','MR','DJ','MG','GN',
    'CM','CD','AO','MZ','TZ','UG',
    'AF','IQ','YE','SO','ER','SS',
    'TD','CF','GW','SL','LR','GM',
    'MR','BI','RW','Et','MW','ZW',
    'SZ','LS','BJ','TG','GH','ZM',
];

// Pays émergents (gratuit + pubs légères, abonnement optionnel)
const PAYS_FREE_ADS_LIGHT = [
    'TR','IN','VN','TH','ID','PH',
    'MY','KZ','UZ','KG','KH','MM',
    'BD','PK','LK','NP','KH','LA',
    'MN','MK','AL','RS','BA','MD',
    'UA','GE','AM','AZ',
];

// Pays premium (paywall obligatoire, ZERO publicité)
const PAYS_PREMIUM = [
    'FR','GB','US','DE','JP','AU',
    'CA','CH','NL','SE','NO','DK',
    'FI','BE','AT','IE','NZ','SG',
    'KR','IL','AE','QA','KW','SA',
    'BH','OM','IT','ES','PT','GR',
    'PL','CZ','HU','SK','SI','HR',
    'RO','BG','LT','LV','EE','MT',
    'CY','LU','LI','IS','MC','AD',
];

/**
 * Retourne le tier de monétisation pour un code pays ISO.
 * 'free_ads'       → Gratuit avec publicités
 * 'free_ads_light' → Gratuit avec pubs légères
 * 'premium_only'   → Paywall obligatoire, 0 pub
 */
function getMonetizationTier(string $country): string {
    $country = strtoupper(trim($country));
    if (in_array($country, PAYS_FREE_ADS))       return 'free_ads';
    if (in_array($country, PAYS_FREE_ADS_LIGHT)) return 'free_ads_light';
    return 'premium_only'; // Sécurité par défaut = premium
}

/**
 * Résout le tier effectif en croisant IP et pays déclaré.
 * En cas de conflit → on applique le tier le plus restrictif.
 */
function resolveEffectiveTier(string $ipCountry, string $declaredCountry, bool $isVerified): string {
    $ipTier        = getMonetizationTier($ipCountry);
    $declaredTier  = getMonetizationTier($declaredCountry);

    // Pays vérifié via téléphone/document → tier déclaré fait foi
    if ($isVerified) return $declaredTier;

    // Pas de conflit → utiliser le pays déclaré
    if ($ipTier === $declaredTier) return $declaredTier;

    // Conflit : IP premium mais déclaré free → sécurité premium
    if ($ipTier === 'premium_only' && in_array($declaredTier, ['free_ads','free_ads_light'])) {
        return 'premium_only';
    }

    // IP free mais déclaré premium → libre (pas de fraude possible)
    return $declaredTier;
}

/**
 * Détecte le pays via Cloudflare (CF-IPCountry) ou via l'IP.
 * DZHoster transmet CF-IPCountry si Cloudflare est activé sur le domaine.
 */
function detectCountryFromRequest(): string {
    // Header Cloudflare (disponible si freegeny.com passe par CF)
    if (!empty($_SERVER['HTTP_CF_IPCOUNTRY'])) {
        return strtoupper($_SERVER['HTTP_CF_IPCOUNTRY']);
    }

    // Fallback : base de données GeoIP locale (optionnel)
    // Si MaxMind GeoLite2 est installé sur DZHoster
    // $ip = $_SERVER['REMOTE_ADDR'];
    // ... lookup via geoip_country_code_by_addr($ip)

    // Défaut : DZ (target principal du MVP)
    return 'DZ';
}

/**
 * Vérifie si le tier autorise l'affichage de publicités.
 */
function showAds(string $tier): bool {
    return in_array($tier, ['free_ads', 'free_ads_light']);
}

/**
 * Vérifie si l'utilisateur doit payer pour accéder au contenu.
 */
function requiresSubscription(string $tier): bool {
    return $tier === 'premium_only';
}

/**
 * Retourne les données de monétisation pour la session courante.
 */
function getSessionMonetization(): array {
    $ipCountry       = detectCountryFromRequest();
    $declaredCountry = $_SESSION['user']['declared_country'] ?? $ipCountry;
    $isVerified      = (bool)($_SESSION['user']['country_verified'] ?? false);
    $tier            = resolveEffectiveTier($ipCountry, $declaredCountry, $isVerified);

    return [
        'ip_country'       => $ipCountry,
        'declared_country' => $declaredCountry,
        'tier'             => $tier,
        'show_ads'         => showAds($tier),
        'requires_payment' => requiresSubscription($tier),
    ];
}
