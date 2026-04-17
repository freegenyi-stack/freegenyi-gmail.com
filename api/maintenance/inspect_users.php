<?php
/**
 * api/maintenance/inspect_users.php - Dashboard de monitoring des tests
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

echo "<h1>📊 Inspection des Utilisateurs FreeGeny</h1>";

try {
    $users = DB::fetchAll("SELECT * FROM users ORDER BY created_at DESC");

    if (empty($users)) {
        echo "<p>Aucun utilisateur en base. (La base est vide après le reset).</p>";
    } else {
        echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%; font-family: sans-serif;'>";
        echo "<tr style='background: #f1f5f9;'>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Email / Tel</th>
                <th>Date d'Inscription</th>
                <th>Dernière Connexion</th>
                <th>Profil</th>
              </tr>";

        foreach ($users as $u) {
            $last_login = $u['last_login_at'] ? date('d/m/Y H:i:s', strtotime($u['last_login_at'])) : '<span style="color: grey;">Jamais</span>';
            $created = date('d/m/Y H:i:s', strtotime($u['created_at']));
            $pct = $u['profile_completion_pct'] ?? 0;
            $role_color = match($u['role']) {
                'parent' => '#2563eb',
                'teacher' => '#10b981',
                'tutor' => '#7c3aed',
                default => '#64748b'
            };

            echo "<tr>";
            echo "<td><b>" . htmlspecialchars($u['full_name']) . "</b></td>";
            echo "<td><span style='background: $role_color; color: white; padding: 2px 8px; rounded: 4px; font-size: 0.8em;'>" . strtoupper($u['role'] ?? 'Parent') . "</span></td>";
            echo "<td>" . htmlspecialchars($u['email']) . "<br><small>" . htmlspecialchars($u['phone'] ?? '-') . "</small></td>";
            echo "<td>$created</td>";
            echo "<td><b>$last_login</b></td>";
            echo "<td align='center'>$pct%</td>";
            echo "</tr>";
        }
        echo "</table>";
    }

} catch (Exception $e) {
    echo "<h3 style='color: red;'>❌ Erreur : " . $e->getMessage() . "</h3>";
}
