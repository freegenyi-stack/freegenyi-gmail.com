<?php
/**
 * emergency_fix.php - RÉPARATION DIRECTE PDO (SANS CLASSES)
 */
$host = "localhost";
$dbname = "freegen1_freegeny_db";
$user = "freegen1_admin";
$pass = "Yousr4568520&";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<h1>Mode Secours Activé...</h1>";

    // 1. Forcer l'ajout de first_name
    try {
        $pdo->exec("ALTER TABLE children ADD COLUMN first_name VARCHAR(100) AFTER parent_id");
        echo "✅ first_name ajouté.<br>";
    } catch(Exception $e) { echo "ℹ️ first_name existe déjà ou erreur : " . $e->getMessage() . "<br>"; }

    // 2. Forcer l'ajout de family_id
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN family_id INT UNSIGNED AFTER role");
        echo "✅ family_id ajouté.<br>";
    } catch(Exception $e) { echo "ℹ️ family_id existe déjà ou erreur : " . $e->getMessage() . "<br>"; }

    echo "<h2>TERMINÉ !</h2>";
    echo "<p>Veuillez rafraîchir votre site maintenant.</p>";

} catch (PDOException $e) {
    echo "❌ Erreur de Connexion : " . $e->getMessage();
}
