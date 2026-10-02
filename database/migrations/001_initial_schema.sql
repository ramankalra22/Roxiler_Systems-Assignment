-- Migration 001: Initial Schema
-- Store Rating Platform

CREATE DATABASE IF NOT EXISTS `store_rating_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `store_rating_db`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(60)  NOT NULL,
  `email`      VARCHAR(255) NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `address`    VARCHAR(400) NOT NULL,
  `role`       ENUM('admin','user','owner') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role`  (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stores table
CREATE TABLE IF NOT EXISTS `stores` (
  `id`             INT           NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(60)   NOT NULL,
  `email`          VARCHAR(255)  NOT NULL UNIQUE,
  `address`        VARCHAR(400)  NOT NULL,
  `owner_id`       INT           NULL,
  `average_rating` DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
  `rating_count`   INT           NOT NULL DEFAULT 0,
  `created_at`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_stores_owner`   (`owner_id`),
  INDEX `idx_stores_name`    (`name`),
  CONSTRAINT `fk_stores_owner` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ratings table
CREATE TABLE IF NOT EXISTS `ratings` (
  `id`         INT       NOT NULL AUTO_INCREMENT,
  `user_id`    INT       NOT NULL,
  `store_id`   INT       NOT NULL,
  `rating`     TINYINT   NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_store` (`user_id`, `store_id`),
  INDEX `idx_ratings_store`  (`store_id`),
  INDEX `idx_ratings_user`   (`user_id`),
  CONSTRAINT `fk_ratings_user`  FOREIGN KEY (`user_id`)  REFERENCES `users`(`id`)  ON DELETE CASCADE,
  CONSTRAINT `fk_ratings_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
