<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

echo "<h1>Diagnostic Base de Données - FreeGeny</h1>";

try {
    $users = DB::fetchAll("SELECT id, email, full_name, created_at FROM users ORDER BY created_at DESC LIMIT 20");
    
    if (empty($users)) {
        echo "<p style='color:red;'>⚠️ AUCUN UTILISATEUR TROUVÉ DANS LA TABLE 'users'.</p>";
    } else {
        echo "<table border='1' cellpadding='10' style='border-collapse:collapse; width:100%;'>";
        echo "<tr style='background:#f1f5f9;'><th>ID</th><th>Email (Exact)</th><th>Nom</th><th>Date Inscription</th></tr>";
        foreach ($users as $u) {
            echo "<tr>";
            echo "<td>{$u['id']}</td>";
            echo "<td style='font-family:monospace; background:#fff7ed;'>'{$u['email']}'</td>";
            echo "<td>{$u['full_name']}</td>";
            echo "<td>{$u['created_at']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    echo "<h3>Test de recherche pour '{$_GET['test']}'</h3>";
    if (!empty($_GET['test'])) {
        $t = strtolower(trim($_GET['test']));
        $found = DB::fetchOne("SELECT id FROM users WHERE email = ?", [$t]);
        if ($found) {
            echo "<p style='color:green;'>✅ Recherche Réussie pour : $t (ID: {$found['id']})</p>";
        } else {
            echo "<p style='color:red;'>❌ Recherche Échouée pour : $t</p>";
        }
    }

} catch (Exception $e) {
    echo "<p style='color:red;'>ERREUR SQL : " . $e->getMessage() . "</p>";
}
?>
<p><a href="?test=votre@email.com">Cliquez ici pour tester une recherche (remplacez par votre email dans l'URL)</a></p>
