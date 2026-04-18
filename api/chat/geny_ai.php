<?php
/**
 * api/chat/geny_ai.php - Geny Expert AI (Hugging Face)
 */
class GenyAI {
    
    public static function getResponse($user_message) {
        $api_token = $_ENV['HF_API_TOKEN'] ?? getenv('HF_API_TOKEN');
        
        if (!$api_token) {
            $env_content = @file_get_contents(__DIR__ . '/../../.env');
            if ($env_content && preg_match('/HF_API_TOKEN\s*=\s*"?([^\s"\n\r]+)"?/', $env_content, $m)) {
                $api_token = $m[1];
            }
        }

        if (!$api_token) {
            return "Je suis Geny Expert 🎓 – Mon token IA n'est pas configuré. Contactez l'administrateur.";
        }

        // Models to try in order (most reliable first)
        $models = [
            "mistralai/Mistral-7B-Instruct-v0.3",
            "HuggingFaceH4/zephyr-7b-beta",
        ];

        $prompt = "<s>[INST] Tu es Geny Expert, conseiller pédagogique d'élite francophone. Réponds de manière courte (2-3 phrases max), claire et encourageante. Question du parent : " . $user_message . " [/INST]";

        foreach ($models as $model) {
            $url = "https://api-inference.huggingface.co/models/" . $model;
            $payload = json_encode([
                "inputs" => $prompt,
                "parameters" => [
                    "max_new_tokens" => 200,
                    "temperature" => 0.7,
                    "return_full_text" => false,
                    "stop" => ["[INST]", "</s>"]
                ],
                "options" => ["wait_for_model" => true]
            ]);

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $payload,
                CURLOPT_TIMEOUT        => 25,
                CURLOPT_CONNECTTIMEOUT => 10,
                CURLOPT_HTTPHEADER     => [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $api_token
                ]
            ]);

            $response = curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($http_code === 200 && $response) {
                $data = json_decode($response, true);
                $text = $data[0]['generated_text'] ?? '';
                
                // Nettoyer les artefacts du prompt
                foreach (["[/INST]", "[INST]", "</s>", "<s>"] as $artifact) {
                    if (strpos($text, $artifact) !== false) {
                        $text = substr($text, strrpos($text, $artifact) + strlen($artifact));
                    }
                }
                $text = trim($text);
                if (!empty($text)) return $text;
            }

            if ($http_code === 503) {
                // Model loading - try next
                error_log("GenyAI: Model $model loading (503), trying next...");
                continue;
            }
        }

        // Fallback intelligent selon le contenu
        $msg_lower = mb_strtolower($user_message);
        if (str_contains($msg_lower, 'math') || str_contains($msg_lower, 'calcul')) {
            return "Les mathématiques s'apprennent mieux avec des exercices quotidiens de 15 minutes. Commencez par les tables de multiplication en jouant ! 🎯";
        } elseif (str_contains($msg_lower, 'lire') || str_contains($msg_lower, 'lecture')) {
            return "La lecture à voix haute 20 minutes par jour transforme les capacités de votre enfant. Choisissez des livres adaptés à leur âge et leurs intérêts ! 📚";
        } elseif (str_contains($msg_lower, 'motiv') || str_contains($msg_lower, 'encour')) {
            return "La motivation naît des petites victoires. Célébrez chaque progrès, même minime. Un enfant encouragé devient un génie accompli ! ✨";
        } elseif (str_contains($msg_lower, 'concentr') || str_contains($msg_lower, 'attention')) {
            return "La concentration s'entraîne comme un muscle. Créez un espace calme, sans écran, et des sessions de travail de 25 minutes suivies de 5 minutes de pause ! 🧠";
        }
        return "Excellente question ! En tant que parent engagé, vous faites déjà la différence. Continuez à soutenir votre enfant avec amour et constance — c'est la clé de leur génie ! 🌟";
    }
}
