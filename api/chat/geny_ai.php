<?php
/**
 * api/chat/geny_ai.php - Le Cerveau de Geny Expert (Via Hugging Face)
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

initSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé'], 401);
}

$input = json_decode(file_get_contents('php://input'), true);
$message = trim($input['message'] ?? '');
$conversation_id = (int)($input['conversation_id'] ?? 0);

if (empty($message)) jsonResponse(['error' => 'Message vide'], 400);

// CONFIGURATION HUGGING FACE (Elite Standard)
// Note: La clé devra être mise dans config/app.php ou .env
$hf_token = defined('HF_TOKEN') ? HF_TOKEN : 'hf_xxxxxxxxxxxxxxxxxxxxxx'; 
$model = "mistralai/Mistral-7B-Instruct-v0.3";

try {
    // 1. Appel à l'API Hugging Face
    $ch = curl_init("https://api-inference.huggingface.co/models/$model");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "inputs" => "<s>[INST] Tu es Geny Expert, l'assistant d'excellence de la plateforme éducative FreeGeny. Tu réponds aux parents et tuteurs avec bienveillance, expertise et précision. Tu aides sur l'éducation, la pédagogie et l'orientation. Réponds de façon concise et élégante à cette question : $message [/INST]",
        "parameters" => ["max_new_tokens" => 500, "temperature" => 0.7]
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $hf_token",
        "Content-Type: application/json"
    ]);

    $response = curl_exec($ch);
    $result = json_decode($response, true);
    curl_close($ch);

    $ai_text = $result[0]['generated_text'] ?? "Désolé, je réfléchis trop en ce moment... Pourriez-vous reformuler ?";
    
    // Nettoyer la réponse (enlever le prompt Mistral si présent)
    if (str_contains($ai_text, "[/INST]")) {
        $ai_text = explode("[/INST]", $ai_text)[1];
    }

    // 2. Enregistrer la réponse de Geny (ID 999) en base
    $ai_id = 999; // ID réservé à Geny
    DB::execute("
        INSERT INTO chat_messages (conversation_id, sender_id, message, message_type) 
        VALUES (?, ?, ?, 'text')
    ", [$conversation_id, $ai_id, trim($ai_text)]);

    jsonResponse([
        'success' => true,
        'reply' => trim($ai_text)
    ]);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
