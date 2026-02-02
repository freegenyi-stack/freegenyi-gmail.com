<?php
/**
 * Configuration de la base de données FreeGeny
 * TEMPLATE - À COPIER ET RENOMMER EN config.php
 * 
 * Instructions :
 * 1. Copiez ce fichier et renommez-le en "config.php"
 * 2. Remplacez les valeurs ci-dessous par vos vrais identifiants
 * 3. NE POUSSEZ JAMAIS config.php sur GitHub !
 */

// Configuration de la base de données
define('DB_HOST', 'localhost'); // Ou 127.0.0.1 selon votre hébergeur
define('DB_NAME', 'votre_prefix_freegeny_content'); // Ex: freegen1_freegeny_content
define('DB_USER', 'votre_prefix_user');              // Ex: freegen1_user
define('DB_PASS', 'VOTRE_MOT_DE_PASSE_ICI');         // Mot de passe généré par cPanel

// Connexion à la base de données
function getDBConnection()
{
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed'
        ]);
        exit;
    }
}
?>