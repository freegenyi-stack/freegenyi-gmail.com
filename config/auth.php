<?php
// ============================================================
// CONFIGURATION AUTHENTIFICATION SOCIALE (POINT 1)
// ============================================================

global $env;

return [
    // URL de retour après connexion (doit correspondre à vos réglages Google/FB)
    'callback' => APP_URL . '/api/auth/social_callback.php',

    'providers' => [
        'Google' => [
            'enabled' => true,
            'keys' => [
                'id'     => $env['GOOGLE_CLIENT_ID'] ?? '',
                'secret' => $env['GOOGLE_CLIENT_SECRET'] ?? '',
            ],
        ],
        'Facebook' => [
            'enabled' => true,
            'keys' => [
                'id'     => 'VOTRE_FACEBOOK_APP_ID',
                'secret' => 'VOTRE_FACEBOOK_APP_SECRET',
            ],
        ],
        'Microsoft' => [
            'enabled' => false, // À activer quand vous aurez les clés
            'keys' => [
                'id'     => '',
                'secret' => '',
            ],
        ],
    ],
];
