<?php
// signup.php - Inscription d'un nouvel utilisateur
require_once 'db_connect.php';

// Récupérer les données POST (JSON)
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->email) &&
    !empty($data->password) &&
    !empty($data->first_name) &&
    !empty($data->last_name) &&
    !empty($data->role)
) {
    // 1. Vérifier si l'utilisateur existe déjà
    $check_query = "SELECT id FROM users WHERE email = :email";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bindParam(':email', $data->email);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["message" => "Cet email est déjà utilisé."]);
        exit();
    }

    // 2. Préparer l'insertion
    $query = "INSERT INTO users (email, password, first_name, last_name, role, provider) 
              VALUES (:email, :password, :first_name, :last_name, :role, 'local')";

    $stmt = $conn->prepare($query);

    // Sécurisation du mot de passe (Hashage)
    $hashed_password = password_hash($data->password, PASSWORD_BCRYPT);

    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':password', $hashed_password);
    $stmt->bindParam(':first_name', $data->first_name);
    $stmt->bindParam(':last_name', $data->last_name);
    $stmt->bindParam(':role', $data->role);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Utilisateur créé avec succès !"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de la création de l'utilisateur."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
}
?>