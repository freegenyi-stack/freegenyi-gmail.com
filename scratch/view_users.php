<?php
/**
 * scratch/view_users.php - Visualisation détaillée des utilisateurs connectés
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

try {
    $users = DB::fetchAll("SELECT id, full_name, email, phone, role, last_login_at, created_at FROM users ORDER BY last_login_at DESC");
    
    echo "<html><head><title>Dashboard Technique | FreeGeny</title>";
    echo "<style>
        body { font-family: sans-serif; padding: 40px; background: #f8fafc; color: #1e293b; }
        h1 { color: #0f172a; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        th { background: #0f172a; color: white; padding: 15px; text-align: left; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 15px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        tr:hover { background: #f1f5f9; }
        .role-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .role-parent { background: #dcfce7; color: #166534; }
        .role-default { background: #f1f5f9; color: #475569; }
        .date { color: #64748b; font-size: 12px; }
    </style></head><body>";

    echo "<h1>👥 Répertoire Global des Utilisateurs</h1>";
    echo "<p>Total : <b>" . count($users) . "</b> utilisateurs enregistrés.</p>";

    if (empty($users)) {
        echo "<p>La base de données est actuellement vide.</p>";
    } else {
        echo "<table><thead><tr>
            <th>Nom Complet</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Rôle / Lien</th>
            <th>Dernière Connexion</th>
            <th>Créé le</th>
        </tr></thead><tbody>";

        foreach ($users as $user) {
            $lastLogin = $user['last_login_at'] ? date('d/m/Y H:i:s', strtotime($user['last_login_at'])) : "Jamais";
            $createdAt = date('d/m/Y H:i', strtotime($user['created_at']));
            $roleClass = ($user['role'] === 'parent') ? 'role-parent' : 'role-default';
            $roleName = $user['role'] ? ucfirst($user['role']) : "Parent";

            echo "<tr>
                <td><b>" . htmlspecialchars($user['full_name']) . "</b></td>
                <td>" . htmlspecialchars($user['email']) . "</td>
                <td>" . htmlspecialchars($user['phone'] ?? '-') . "</td>
                <td><span class='role-badge $roleClass'>$roleName</span></td>
                <td class='date'>$lastLogin</td>
                <td class='date'>$createdAt</td>
            </tr>";
        }
        echo "</tbody></table>";
    }

    echo "<br><br><a href='/'>← Retour au site</a>";
    echo "</body></html>";

} catch (Exception $e) {
    echo "Erreur : " . $e->getMessage();
}
