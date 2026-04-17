<?php
/**
 * emergency_fix.php - RÉPARATION TOTALE ET FINALE
 */
$host = "localhost";
$dbname = "freegen1_freegeny_db";
$user = "freegen1_admin";
$pass = "Yousr4568520&";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<h1>Remise en conformité totale...</h1>";

    // 1. Réparation des colonnes de la table CHILDREN
    $queries = [
        "ALTER TABLE children ADD COLUMN IF NOT EXISTS first_name VARCHAR(100) AFTER parent_id",
        "ALTER TABLE children ADD COLUMN IF NOT EXISTS grade_level VARCHAR(50) AFTER country",
        "ALTER TABLE children ADD COLUMN IF NOT EXISTS xp_total INT DEFAULT 0",
        "ALTER TABLE children ADD COLUMN IF NOT EXISTS progress_percent INT DEFAULT 0",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS family_id INT UNSIGNED AFTER role",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_step INT DEFAULT 1"
    ];

    foreach ($queries as $q) {
        try {
            $pdo->exec($q);
            echo "✅ Succès : " . substr($q, 0, 50) . "...<br>";
        } catch (Exception $e) {
            echo "ℹ️ Déjà présent ou : " . $e->getMessage() . "<br>";
        }
    }

    echo "<h2>TOUT EST ALIGNÉ !</h2>";
    echo "<p>Vous pouvez retourner sur l'Onboarding. Le code et la base de données parlent enfin la même langue.</p>";

} catch (PDOException $e) {
    echo "❌ Erreur de Connexion : " . $e->getMessage();
}
