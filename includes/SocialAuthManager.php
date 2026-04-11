<?php
class SocialAuthManager {
    private $clientId;
    private $clientSecret;
    private $redirectUri;

    public function __construct() {
        // Récupération des clés depuis l'environnement (déjà chargé par config/app.php)
        $this->clientId = $_ENV['GOOGLE_CLIENT_ID'] ?? '';
        $this->clientSecret = $_ENV['GOOGLE_CLIENT_SECRET'] ?? '';
        $this->redirectUri = APP_URL . '/api/auth/google_callback.php';
    }

    public function getAuthUrl($state = '') {
        $params = [
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'access_type' => 'offline',
            'prompt' => 'select_account',
            'state' => $state
        ];
        return 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
    }

    public function handleCallback($code) {
        // Échange du code contre un access token
        $url = 'https://oauth2.googleapis.com/token';
        $data = [
            'code' => $code,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'redirect_uri' => $this->redirectUri,
            'grant_type' => 'authorization_code'
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        $response = curl_exec($ch);
        $tokenData = json_decode($response, true);
        curl_close($ch);

        if (isset($tokenData['access_token'])) {
            return $this->getUserInfo($tokenData['access_token']);
        }
        return false;
    }

    private function getUserInfo($accessToken) {
        $url = 'https://www.googleapis.com/oauth2/v3/userinfo';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $accessToken]);
        $response = curl_exec($ch);
        $userInfo = json_decode($response, true);
        curl_close($ch);
        return $userInfo;
    }
}
?>
