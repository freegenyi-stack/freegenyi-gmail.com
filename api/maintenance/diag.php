<?php
require_once __DIR__ . '/../../config/app.php';
if (($_GET['pw'] ?? '') !== MAINTENANCE_PASSWORD) die("Accès refusé.");

header('Content-Type: text/html; charset=utf-8');
echo "<style>body{font-family:monospace;padding:20px;background:#111;color:#eee;} .ok{color:#0f0;} .err{color:#f44;} .warn{color:#fa0;} h2{color:#08f;border-bottom:1px solid #333;}</style>";
echo "<h1>🔍 FreeGeny Diagnostic</h1>";

// ===== 1. TABLES =====
echo "<h2>1. Tables existantes</h2>";
$tables = DB::fetchAll("SHOW TABLES");
$table_names = [];
foreach ($tables as $t) {
    $name = array_values($t)[0];
    $table_names[] = $name;
    echo "<span class='ok'>✅ $name</span><br>";
}
$required = ['users','children','invitations','conversations','conversation_members','chat_messages','activity_logs'];
foreach ($required as $r) {
    if (!in_array($r, $table_names)) echo "<span class='err'>❌ MANQUANTE: $r</span><br>";
}

// ===== 2. COLONNES USERS =====
echo "<h2>2. Colonnes de 'users'</h2>";
$cols = DB::fetchAll("SHOW COLUMNS FROM users");
foreach ($cols as $c) echo "<span class='ok'>" . $c['Field'] . " (" . $c['Type'] . ")</span><br>";

// ===== 3. COLONNES chat_messages =====
echo "<h2>3. Colonnes de 'chat_messages'</h2>";
try {
    $cols = DB::fetchAll("SHOW COLUMNS FROM chat_messages");
    foreach ($cols as $c) echo "<span class='ok'>" . $c['Field'] . " (" . $c['Type'] . ")</span><br>";
} catch (Exception $e) { echo "<span class='err'>❌ " . $e->getMessage() . "</span>"; }

// ===== 4. COLONNES invitations =====
echo "<h2>4. Colonnes de 'invitations'</h2>";
try {
    $cols = DB::fetchAll("SHOW COLUMNS FROM invitations");
    foreach ($cols as $c) echo "<span class='ok'>" . $c['Field'] . " (" . $c['Type'] . ")</span><br>";
} catch (Exception $e) { echo "<span class='err'>❌ " . $e->getMessage() . "</span>"; }

// ===== 5. USERS EN BASE =====
echo "<h2>5. Utilisateurs (hors Geny)</h2>";
$users = DB::fetchAll("SELECT id, email, full_name, role, family_id, onboarding_step FROM users WHERE id != 999");
if (empty($users)) echo "<span class='warn'>⚠️ Aucun utilisateur</span><br>";
foreach ($users as $u) {
    echo "<span class='ok'>ID:{$u['id']} | {$u['email']} | {$u['full_name']} | role:{$u['role']} | family_id:{$u['family_id']} | step:{$u['onboarding_step']}</span><br>";
}

// ===== 6. INVITATIONS =====
echo "<h2>6. Invitations</h2>";
try {
    $invs = DB::fetchAll("SELECT * FROM invitations ORDER BY created_at DESC LIMIT 10");
    if (empty($invs)) echo "<span class='warn'>⚠️ Aucune invitation</span><br>";
    foreach ($invs as $i) {
        echo "<span class='ok'>ID:{$i['id']} | from:{$i['sender_id']} | to:{$i['email']} | status:{$i['status']}</span><br>";
    }
} catch (Exception $e) { echo "<span class='err'>❌ " . $e->getMessage() . "</span>"; }

// ===== 7. TEST SEND MESSAGE =====
echo "<h2>7. Test d'envoi de message (simulation)</h2>";
try {
    // Check if ai conversation exists for first real user
    $first_user = DB::fetchOne("SELECT id FROM users WHERE id != 999 LIMIT 1");
    if ($first_user) {
        $ai_conv = DB::fetchOne("SELECT c.id FROM conversations c JOIN conversation_members m ON c.id = m.conversation_id WHERE c.type = 'ai' AND m.user_id = ?", [$first_user['id']]);
        if ($ai_conv) {
            echo "<span class='ok'>✅ Conversation AI existe (ID:{$ai_conv['id']}) pour user {$first_user['id']}</span><br>";
            // Try inserting a test message
            $msg_id = DB::insert("INSERT INTO chat_messages (conversation_id, sender_id, message) VALUES (?, ?, ?)", [$ai_conv['id'], $first_user['id'], 'TEST_DIAGNOSTIC_MSG']);
            if ($msg_id) {
                echo "<span class='ok'>✅ Message test inséré (ID:$msg_id) - La table fonctionne !</span><br>";
                DB::execute("DELETE FROM chat_messages WHERE id = ?", [$msg_id]);
                echo "<span class='ok'>✅ Message test supprimé.</span><br>";
            } else {
                echo "<span class='err'>❌ Impossible d'insérer un message !</span><br>";
            }
        } else {
            echo "<span class='warn'>⚠️ Pas de conversation AI pour user {$first_user['id']}</span><br>";
        }
    }
} catch (Exception $e) {
    echo "<span class='err'>❌ ERREUR: " . $e->getMessage() . "</span><br>";
}

// ===== 8. MESSAGES EN BASE =====
echo "<h2>8. Messages existants</h2>";
try {
    $msgs = DB::fetchAll("SELECT m.id, m.conversation_id, m.sender_id, LEFT(m.message,50) as msg, m.created_at FROM chat_messages m ORDER BY m.created_at DESC LIMIT 10");
    if (empty($msgs)) echo "<span class='warn'>⚠️ Aucun message en base</span><br>";
    foreach ($msgs as $m) echo "<span class='ok'>ID:{$m['id']} | conv:{$m['conversation_id']} | from:{$m['sender_id']} | {$m['msg']}</span><br>";
} catch (Exception $e) { echo "<span class='err'>❌ " . $e->getMessage() . "</span>"; }

echo "<br><p style='color:#888'>Diagnostic terminé.</p>";
