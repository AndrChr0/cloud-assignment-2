CREATE DATABASE cloud_reddit_db;
use cloud_reddit_db;

CREATE TABLE `categories` (
  `category_id` tinyint(255) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(200) NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `user_id` SMALLINT(255) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`username`, `email`, `password`) VALUES
('andreas', 'andreas@example.com', 'andreas'),
('john_doe', 'john.doe@example.com', 'password123'),
('jane_doe', 'jane.doe@example.com', 'password456'),
('alex_smith', 'alex.smith@example.com', 'password789'),
('emma_jones', 'emma.jones@example.com', 'password101');

CREATE TABLE `posts` (
  `post_id` mediumint(255) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `content` varchar(500) NOT NULL,
  `user_id` smallint(255) unsigned NOT NULL,
  `category_id` tinyint(255) unsigned NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `poster_idx` (`user_id`),
  KEY `category_idx` (`category_id`),
  CONSTRAINT `category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `poster` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `likes` (
  `like_id` mediumint(255) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint(255) unsigned NOT NULL,
  `post_id` mediumint(255) unsigned NOT NULL,
  PRIMARY KEY (`like_id`),
  KEY `liker_idx` (`user_id`),
  KEY `liked_post_idx` (`post_id`),
  CONSTRAINT `liked_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `liker` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

