-- ============================================================
-- SCHÉMA AUTHENTIFICATION MULTI-PROVIDER (POINT 1)
-- ============================================================

-- Table principale des utilisateurs
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `full_name` VARCHAR(100),
  `password` VARCHAR(255) NULL, -- NULL car les comptes sociaux n'ont pas forcément de mot de passe
  `country_code` CHAR(2),       -- Pour le Point 3 (Reconnaissance pays)
  `role` ENUM('parent', 'admin') DEFAULT 'parent',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des comptes sociaux liés
CREATE TABLE IF NOT EXISTS `user_social_accounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `provider` ENUM('google', 'facebook', 'microsoft', 'instagram') NOT NULL,
  `provider_id` VARCHAR(191) NOT NULL, -- L'ID unique envoyé par le réseau social
  `token` TEXT, -- Optionnel : pour des appels API futurs
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_provider_id` (`provider`, `provider_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
