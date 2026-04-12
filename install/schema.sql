-- ============================================================
-- FreeGeny — Schéma MySQL complet
-- À exécuter dans phpMyAdmin (DZHoster cPanel)
-- Collation : utf8mb4_unicode_ci (support arabe + emoji)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `v_child_stats`;
DROP TABLE IF EXISTS `country_conflicts`;
DROP TABLE IF EXISTS `login_attempts`;
DROP TABLE IF EXISTS `communication_hub`;
DROP TABLE IF EXISTS `academic_calendar`;
DROP TABLE IF EXISTS `child_rewards`;
DROP TABLE IF EXISTS `user_sessions`;
DROP TABLE IF EXISTS `achievements`;
DROP TABLE IF EXISTS `exercise_attempts`;
DROP TABLE IF EXISTS `child_progress`;
DROP TABLE IF EXISTS `children`;
DROP TABLE IF EXISTS `users`;

-- -----------------------------------------------------------
-- Table : users (comptes parents/admins)
-- -----------------------------------------------------------
CREATE TABLE `users` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email`                 VARCHAR(255) NOT NULL UNIQUE,
  `password_hash`         VARCHAR(255) NOT NULL,
  `full_name`             VARCHAR(255) NOT NULL DEFAULT '',
  `avatar`                VARCHAR(100) NOT NULL DEFAULT 'default',
  `declared_country`      CHAR(2) NOT NULL DEFAULT 'DZ',
  `country_verified`      TINYINT(1) NOT NULL DEFAULT 0,
  `subscription_status`   ENUM('free','active','canceled','past_due') NOT NULL DEFAULT 'free',
  `subscription_expires_at` DATETIME DEFAULT NULL,
  `stripe_customer_id`    VARCHAR(100) DEFAULT NULL,
  `email_verified`        TINYINT(1) NOT NULL DEFAULT 0,
  `email_verify_token`    VARCHAR(64) DEFAULT NULL,
  `login_attempts`        TINYINT NOT NULL DEFAULT 0,
  `locked_until`          DATETIME DEFAULT NULL,
  `last_login_at`         DATETIME DEFAULT NULL,
  `created_at`            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_subscription` (`subscription_status`, `subscription_expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Table : children (profils enfants liés à un parent)
-- -----------------------------------------------------------
CREATE TABLE `children` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `parent_id`       INT UNSIGNED NOT NULL,
  `name`            VARCHAR(100) NOT NULL,
  `age`             TINYINT UNSIGNED DEFAULT NULL,
  `country`         CHAR(2) NOT NULL DEFAULT 'DZ',
  `grade`           VARCHAR(20) NOT NULL DEFAULT '1AP',
  `language`        VARCHAR(5) NOT NULL DEFAULT 'ar',
  `avatar`          VARCHAR(50) NOT NULL DEFAULT 'avatar1',
  `interests`       JSON DEFAULT NULL,
  `emotional_boost_audio` VARCHAR(255) DEFAULT NULL,
  `xp_total`        INT UNSIGNED NOT NULL DEFAULT 0,
  `streak_days`     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `longest_streak`  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `last_active_date` DATE DEFAULT NULL,
  `screen_time_limit_min` SMALLINT UNSIGNED DEFAULT NULL COMMENT 'Limite quotidienne en minutes (contrôle parental)',
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Table : child_progress (progression par leçon)
-- -----------------------------------------------------------
CREATE TABLE `child_progress` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `child_id`      INT UNSIGNED NOT NULL,
  `lesson_id`     VARCHAR(100) NOT NULL,
  `subject`       ENUM('arabe','mathematiques','sciences','histoire') NOT NULL DEFAULT 'arabe',
  `grade`         VARCHAR(20) NOT NULL DEFAULT '1AP',
  `status`        ENUM('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
  `score`         DECIMAL(5,2) DEFAULT NULL COMMENT 'Score sur 10',
  `time_spent_sec` INT UNSIGNED NOT NULL DEFAULT 0,
  `completed_at`  DATETIME DEFAULT NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_progress` (`child_id`, `lesson_id`),
  FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE,
  INDEX `idx_child_subject` (`child_id`, `subject`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Table : exercise_attempts (tentatives d'exercices)
-- -----------------------------------------------------------
CREATE TABLE `exercise_attempts` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `child_id`        INT UNSIGNED NOT NULL,
  `exercise_id`     VARCHAR(100) NOT NULL,
  `lesson_id`       VARCHAR(100) NOT NULL,
  `exercise_type`   VARCHAR(50) NOT NULL DEFAULT 'qcm',
  `is_correct`      TINYINT(1) DEFAULT NULL,
  `attempt_data`    JSON DEFAULT NULL COMMENT 'Reponse donnee par l_enfant',
  `time_spent_sec`  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `xp_earned`       SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE,
  INDEX `idx_child_lesson` (`child_id`, `lesson_id`),
  INDEX `idx_exercise` (`exercise_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Table : achievements (badges et récompenses)
-- -----------------------------------------------------------
CREATE TABLE `achievements` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `child_id`    INT UNSIGNED NOT NULL,
  `badge_type`  VARCHAR(100) NOT NULL,
  `badge_level` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `earned_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_badge` (`child_id`, `badge_type`, `badge_level`),
  FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Table : user_sessions (tokens de session sécurisés)
-- -----------------------------------------------------------
CREATE TABLE `user_sessions` (
  `id`          VARCHAR(64) PRIMARY KEY COMMENT 'Token aléatoire 32 bytes hex',
  `user_id`     INT UNSIGNED NOT NULL,
  `ip_address`  VARCHAR(45) DEFAULT NULL,
  `user_agent`  VARCHAR(500) DEFAULT NULL,
  `expires_at`  DATETIME NOT NULL,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Table : child_rewards (Pont des Récompenses)
-- -----------------------------------------------------------
CREATE TABLE `child_rewards` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `child_id`        INT UNSIGNED NOT NULL,
  `suggestion`      VARCHAR(255) NOT NULL,
  `custom_reward`   VARCHAR(255) DEFAULT NULL,
  `status`          ENUM('pending', 'validated', 'claimed') NOT NULL DEFAULT 'pending',
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Table : academic_calendar (Dates clés)
-- -----------------------------------------------------------
CREATE TABLE `academic_calendar` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `child_id`        INT UNSIGNED NOT NULL,
  `event_name`      VARCHAR(100) NOT NULL,
  `event_type`      ENUM('exam', 'holiday', 'other') NOT NULL DEFAULT 'exam',
  `start_date`      DATE NOT NULL,
  `end_date`        DATE DEFAULT NULL,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Table : communication_hub (Lien Parent-Enseignant)
-- -----------------------------------------------------------
CREATE TABLE `communication_hub` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `sender_id`       INT UNSIGNED NOT NULL,
  `receiver_id`     INT UNSIGNED NOT NULL,
  `child_id`        INT UNSIGNED NOT NULL,
  `message`         TEXT NOT NULL,
  `type`            ENUM('chat', 'notebook') NOT NULL DEFAULT 'chat',
  `is_read`         TINYINT(1) NOT NULL DEFAULT 0,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `login_attempts` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email`       VARCHAR(255) NOT NULL,
  `ip_address`  VARCHAR(45) NOT NULL,
  `success`     TINYINT(1) NOT NULL DEFAULT 0,
  `attempted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email_ip` (`email`, `ip_address`),
  INDEX `idx_attempted` (`attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Table : country_conflicts (anti-VPN / anti-fraude)
-- -----------------------------------------------------------
CREATE TABLE `country_conflicts` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`       INT UNSIGNED NOT NULL,
  `ip_country`    CHAR(2) NOT NULL,
  `declared_country` CHAR(2) NOT NULL,
  `resolved_tier` VARCHAR(30) NOT NULL,
  `detected_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Vue : stats résumées par enfant (pour le dashboard parent)
-- -----------------------------------------------------------
CREATE OR REPLACE VIEW `v_child_stats` AS
SELECT
  c.id                                              AS child_id,
  c.name                                            AS child_name,
  c.xp_total,
  c.streak_days,
  COUNT(DISTINCT cp.lesson_id)                      AS lessons_total,
  SUM(cp.status = 'completed')                      AS lessons_completed,
  ROUND(AVG(CASE WHEN cp.status = 'completed' THEN cp.score END), 1) AS avg_score,
  COUNT(DISTINCT ea.id)                             AS exercises_total,
  SUM(ea.is_correct = 1)                            AS exercises_correct,
  SUM(cp.time_spent_sec)                            AS total_time_sec
FROM children c
LEFT JOIN child_progress cp  ON cp.child_id = c.id
LEFT JOIN exercise_attempts ea ON ea.child_id = c.id
GROUP BY c.id;

SET FOREIGN_KEY_CHECKS = 1;
