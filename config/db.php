<?php
// ============================================================
// FreeGeny — Connexion Base de Données (PDO + MySQL)
// ============================================================

class DB {
    private static ?PDO $instance = null;

    private function __construct() {}

    public static function getInstance(): PDO {
        if (self::$instance === null) {
            $host    = getenv('DB_HOST')    ?: 'localhost';
            $dbname  = getenv('DB_NAME')    ?: 'freegeny_db';
            $user    = getenv('DB_USER')    ?: '';
            $pass    = getenv('DB_PASS')    ?: '';
            $charset = 'utf8mb4';

            $dsn = "mysql:host={$host};dbname={$dbname};charset={$charset}";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                if (defined('DEBUG') && DEBUG) {
                    throw $e;
                }
                error_log('DB Connection Error: ' . $e->getMessage());
                http_response_code(500);
                die(json_encode(['error' => 'Service temporairement indisponible. Réessayez plus tard.']));
            }
        }
        return self::$instance;
    }

    /**
     * Exécute une requête préparée et retourne le statement.
     */
    public static function query(string $sql, array $params = []): PDOStatement {
        $stmt = self::getInstance()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    /**
     * Récupère une seule ligne.
     */
    public static function fetchOne(string $sql, array $params = []): ?array {
        $result = self::query($sql, $params)->fetch();
        return $result ?: null;
    }

    /**
     * Récupère toutes les lignes.
     */
    public static function fetchAll(string $sql, array $params = []): array {
        return self::query($sql, $params)->fetchAll();
    }

    /**
     * Insère et retourne le dernier ID inséré.
     */
    public static function insert(string $sql, array $params = []): int|string {
        self::query($sql, $params);
        return self::getInstance()->lastInsertId();
    }

    /**
     * Exécute une requête et retourne le nombre de lignes affectées.
     */
    public static function execute(string $sql, array $params = []): int {
        return self::query($sql, $params)->rowCount();
    }

    /**
     * Transaction wrapper.
     */
    public static function transaction(callable $callback): mixed {
        $pdo = self::getInstance();
        $pdo->beginTransaction();
        try {
            $result = $callback($pdo);
            $pdo->commit();
            return $result;
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}
