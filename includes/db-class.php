<?php
/**
 * includes/db-class.php - Wrap PDO into a simple static class for easy access
 */

class DB {
    public static function fetchOne($sql, $params = []) {
        global $pdo;
        if (!isset($pdo)) {
            require_once __DIR__ . '/../config/db.php';
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch() ?: null;
    }

    public static function fetchAll($sql, $params = []) {
        global $pdo;
        if (!isset($pdo)) {
            require_once __DIR__ . '/../config/db.php';
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function execute($sql, $params = []) {
        global $pdo;
        if (!isset($pdo)) {
            require_once __DIR__ . '/../config/db.php';
        }
        $stmt = $pdo->prepare($sql);
        return $stmt->execute($params);
    }

    public static function insert($sql, $params = []) {
        global $pdo;
        if (!isset($pdo)) {
            require_once __DIR__ . '/../config/db.php';
        }
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute($params)) {
            return $pdo->lastInsertId();
        }
        return false;
    }
}
