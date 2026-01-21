<?php
// db_connect.php - Connexion centrale à la base de données
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// --- CONFIGURATION À REMPLIR ---
$host = "localhost";
$db_name = "freegen1_app"; // ex: freegen1_app
$username = "freegen1_admin";   // ex: freegen1_flutter
$password = "Yousr4568520&";
// -------------------------------

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ATTR_ERRMODE_EXCEPTION);
    // Supprimer cette ligne en production si tout marche
    // echo json_encode(["message" => "Connexion réussie !"]); 
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
    exit();
}
?>