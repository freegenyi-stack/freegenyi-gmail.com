<?php
/**
 * api/chat/geny_ai.php - Le Cerveau de Geny Expert (Propulsé par Hugging Face)
 * ✅ 100% Gratuit
 */
require_once __DIR__ . '/../../config/app.php';

class GenyAI {
    private static $api_token = null;
    private static $model = "mistralai/Mistral-7B-Instruct-v0.3"; 

    /**
     * Appelle Hugging Face pour une réponse pédagogique gratuite
     */
    public static function getResponse($user_message, $context = []) {
        // 1. Récupérer le token Hugging Face depuis .env
        if (self::$api_token === null) {
            $env = loadEnv(__DIR__ . '/../../.env');
            self::$api_token = $env['HF_API_TOKEN'] ?? null;
        }

        if (!self::$api_token) {
            return "Bonjour ! Je suis Geny Expert. (Mode Démo : Veuillez configurer HF_API_TOKEN pour la pleine puissance). Je vous suggère d'encourager votre enfant par le jeu !";
        }

        // 2. Préparer l'appel API Hugging Face
        $url = "https://api-inference.huggingface.co/models/" . self::$model;
        
        $prompt = "<s>[INST] Tu es Geny Expert, conseiller pédagogique d'élite. Réponds de manière courte (3 phrases max) et encourageante à un parent sur ce sujet particulier : " . $user_message . " [/INST]";

        $payload = [
            "inputs" => $prompt,
            "parameters" => [
                "max_new_tokens" => 250,
                "temperature" => 0.7,
                "return_full_text" => false
            ]
        ];

        // 3. Exécuter CURL
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . self::$api_token
        ]);
        
        $response = curl_exec($ch);
        $data = json_decode($response, true);
        curl_close($ch);

        // 4. Extraire le texte de réponse
        return $data[0]['generated_text'] ?? $data['generated_text'] ?? "Le savoir est une aventure ! Reposons la question différemment.";
    }
}
