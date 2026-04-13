<?php
require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/api/auth/auth_helpers.php';

$col = DB::fetchOne("SHOW COLUMNS FROM children LIKE 'secondary_parent_id'");
if (!$col) {
    DB::execute("ALTER TABLE children ADD COLUMN secondary_parent_id INT UNSIGNED DEFAULT NULL AFTER parent_id");
    echo "Colon ADDED.";
} else {
    echo "Already EXISTS.";
}
