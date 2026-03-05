<?php
// login.php - Connexion utilisateur et génération de Token
require_once 'db_connect.php';

// --- CONFIGURATION SÉCURITÉ ---
$secret_key = "CHANGE_MOI_AVEC_UNE_PHRASE_TRES_LONGUE_ET_SECRET_123!"; // Clé pour signer les tokens
// ------------------------------

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {

    $query = "SELECT id, email, password, first_name, last_name, role FROM users WHERE email = :email LIMIT 0,1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérification du mot de passe
        if (password_verify($data->password, $row['password'])) {

            // Génération d'un Token simple (Format JWT Lite)
            $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
            $payload = json_encode([
                'user_id' => $row['id'],
                'email' => $row['email'],
                'role' => $row['role'],
                'exp' => time() + (3600 * 24) // Expire dans 24h
            ]);

            $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
            $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
            $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true);
            $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

            $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

            http_response_code(200);
            echo json_encode([
                "message" => "Connexion réussie",
                "token" => $jwt,
                "user" => [
                    "id" => $row['id'],
                    "first_name" => $row['first_name'],
                    "last_name" => $row['last_name'],
                    "role" => $row['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Mot de passe incorrect."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Utilisateur non trouvé."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
}
?>