CREATE DATABASE cloud_reddit_db;
USE cloud_reddit_db;

CREATE TABLE `categories` (
  `category_id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(200) NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categories` (`name`, `description`, `creation_date`) VALUES
('CoryInTheHouse', 'For all the mean boiiis', '2024-05-05 00:00:00'),
('BissePump', 'Learn the way', '2024-05-05 00:00:00'),
('DankMemes', 'Dank memes', '2024-05-05 00:00:00'),
('Programming', 'For all the programmers', '2024-05-05 00:00:00'),
('Gaming', 'For all the gamers', '2024-05-05 00:00:00');

CREATE TABLE `users` (
  `user_id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`username`, `email`, `password`) VALUES
('andreas', 'andreas@example.com', 'andreas'),
('Paul_Teach', 'paul@er.kul', 'pauul<3'),
('dev', 'dev@dev.com', 'dev'),
('ola', 'olansk@olansk.com', 'olansk'),
('Christopher_Ngo', 'chrngo@example.com', 'ngoooo');

CREATE TABLE `posts` (
  `post_id` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `content` varchar(500) NOT NULL,
  `user_id` smallint unsigned NOT NULL,
  `category_id` tinyint unsigned NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `poster_idx` (`user_id`),
  KEY `category_idx` (`category_id`),
  CONSTRAINT `category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `poster` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `posts` (`title`, `content`, `user_id`, `category_id`, `creation_date`) VALUES
('I am a mean boi', 'I am a mean boi', 1, 1, '2024-05-05 10:00:00'),
('Learn the Way', 'The only way to pump is the BissePump way!', 2, 2, '2024-05-06 12:00:00'),
('Top Dank Memes', 'Check out these top dank memes of the week.', 3, 3, '2024-05-06 13:00:00'),
('Programming Tips', 'Best practices for writing clean code.', 4, 4, '2024-05-07 14:00:00'),
('Gaming Highlights', 'Top highlights from this week in gaming.', 5, 5, '2024-05-07 15:00:00'),
('BissePump 101', 'Introduction to BissePump training.', 2, 2, '2024-05-08 16:00:00'),
('Meme Review', 'Reviewing the latest memes.', 3, 3, '2024-05-08 17:00:00'),
('Code Review', 'How to do a proper code review.', 4, 4, '2024-05-08 18:00:00'),
('Latest Games', 'Upcoming game releases to watch.', 5, 5, '2024-05-09 19:00:00');

CREATE TABLE `likes` (
  `like_id` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint unsigned NOT NULL,
  `post_id` mediumint unsigned NOT NULL,
  PRIMARY KEY (`like_id`),
  KEY `liker_idx` (`user_id`),
  KEY `liked_post_idx` (`post_id`),
  CONSTRAINT `liked_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `liker` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
