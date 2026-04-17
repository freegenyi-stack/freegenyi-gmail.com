<?php
/**
 * api/chat/geny_ai.php - Le Cerveau de Geny Expert (Propulsé par Google Gemini)
 */
require_once __DIR__ . '/../../config/app.php';

class GenyAI {
    private static $api_key = null;
    private static $model = "gemini-1.5-flash";

    /**
     * Appelle l'API Gemini pour générer une réponse pédagogique
     */
    public static function getResponse($user_message, $context = []) {
        // 1. Récupérer la clé API depuis .env
        if (self::$api_key === null) {
            $env = loadEnv(__DIR__ . '/../../.env');
            self::$api_key = $env['GEMINI_API_KEY'] ?? null;
        }

        if (!self::$api_key) {
            return "Désolé, ma connexion avec le centre de savoir est en maintenance (Clé API manquante). Revenez vite !";
        }

        // 2. Préparer le "System Prompt" (La personnalité de Geny)
        $system_prompt = "Tu es Geny Expert, un conseiller pédagogique d'élite pour FreeGeny. 
        Ton rôle est d'aider les parents algériens et internationaux à accompagner la scolarité primaire de leurs enfants. 
        Sois toujours encourageant, utilise des termes simples mais précis basés sur les neurosciences et les méthodes mondiales (Singapour, Oxford).
        Réponds de manière concise (max 3-4 phrases).";

        // 3. Préparer la requête
        $url = "https://generativelanguage.googleapis.com/v1beta/models/" . self::$model . ":generateContent?key=" . self::$api_key;
        
        $payload = [
            "contents" => [
                [
                    "role" => "user",
                    "parts" => [
                        ["text" => $system_prompt . "\n\nQuestion du parent : " . $user_message]
                    ]
                ]
            ],
            "generationConfig" => [
                "temperature" => 0.7,
                "maxOutputTokens" => 300
            ]
        ];

        // 4. Exécuter l'appel CURL
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        
        $response = curl_exec($ch);
        $data = json_decode($response, true);
        curl_close($ch);

        // 5. Extraire la réponse
        return $data['candidates'][0]['content']['parts'][0]['text'] ?? "Oups, j'ai eu une petite absence. Pouvez-vous répéter ?";
    }
}
