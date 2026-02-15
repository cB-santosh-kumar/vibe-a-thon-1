-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: interview
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `interview_answers`
--

DROP TABLE IF EXISTS `interview_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_answers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` bigint unsigned NOT NULL,
  `question_id` bigint unsigned NOT NULL,
  `answer_text` text NOT NULL,
  `score` decimal(4,2) NOT NULL,
  `feedback` text,
  `strengths` json DEFAULT NULL,
  `improvements` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_answers_session_id` (`session_id`),
  KEY `ix_answers_question_id` (`question_id`),
  CONSTRAINT `fk_answers_question_id` FOREIGN KEY (`question_id`) REFERENCES `interview_questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_answers_session_id` FOREIGN KEY (`session_id`) REFERENCES `interview_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_answers`
--

LOCK TABLES `interview_answers` WRITE;
/*!40000 ALTER TABLE `interview_answers` DISABLE KEYS */;
INSERT INTO `interview_answers` VALUES (1,1,2,'Implement load shedding by monitoring system load in real time (CPU, memory, queue length, latency) and defining thresholds. When a component becomes overloaded, reject, delay, or downgrade low-priority requests instead of letting queues grow. Use circuit breakers, rate limiting, backpressure, and graceful degradation to protect critical services and prevent cascading failures.',8.00,'Good effort! You\'ve covered some key concepts, but could benefit from more depth and examples.','[\"Monitoring system load in real-time is a good approach\", \"Defining thresholds for CPU, memory, queue length, and latency is a solid step\", \"Using circuit breakers, rate limiting, backpressure, and graceful degradation are effective techniques\"]','[\"The answer could provide more detail on how to implement these strategies in code\", \"It would be helpful to include an example of how load shedding can prevent cascading failures\", \"Consider discussing the trade-offs between rejecting low-priority requests and delaying them\"]','2026-02-15 13:01:12');
/*!40000 ALTER TABLE `interview_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interview_questions`
--

DROP TABLE IF EXISTS `interview_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` bigint unsigned NOT NULL,
  `question_text` text NOT NULL,
  `difficulty` varchar(40) NOT NULL,
  `is_followup` tinyint(1) NOT NULL DEFAULT '0',
  `order_index` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_questions_session_id` (`session_id`),
  CONSTRAINT `fk_questions_session_id` FOREIGN KEY (`session_id`) REFERENCES `interview_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_questions`
--

LOCK TABLES `interview_questions` WRITE;
/*!40000 ALTER TABLE `interview_questions` DISABLE KEYS */;
INSERT INTO `interview_questions` VALUES (1,1,'Design a system to handle thousands of concurrent connections from clients without compromising performance.','medium',0,1,'2026-02-15 12:53:50'),(2,1,'Describe an approach to implementing load shedding in a distributed system to prevent cascading failures when one component becomes overwhelmed.','medium',0,2,'2026-02-15 12:54:56'),(3,2,'Explain the difference between HTTP GET and HTTP POST methods in RESTful API design.','medium',0,1,'2026-02-15 13:11:29'),(4,2,'How does the TCP three-way handshake ensure reliable data transfer in client-server communication?','medium',0,2,'2026-02-15 13:57:52');
/*!40000 ALTER TABLE `interview_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interview_reports`
--

DROP TABLE IF EXISTS `interview_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` bigint unsigned NOT NULL,
  `overall_score_10` decimal(4,2) NOT NULL,
  `overall_score_100` decimal(5,2) NOT NULL,
  `strengths` json NOT NULL,
  `improvement_areas` json NOT NULL,
  `improved_answers` json NOT NULL,
  `next_topics` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_reports_session_id` (`session_id`),
  CONSTRAINT `fk_reports_session_id` FOREIGN KEY (`session_id`) REFERENCES `interview_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_reports`
--

LOCK TABLES `interview_reports` WRITE;
/*!40000 ALTER TABLE `interview_reports` DISABLE KEYS */;
INSERT INTO `interview_reports` VALUES (1,1,6.50,65.00,'[\"Structured thinking\", \"Clear communication\", \"Basic correctness\"]','[\"Depth of examples\", \"Edge cases\", \"Performance tradeoffs\"]','[\"Add a more detailed example for the last question.\"]','[\"System design fundamentals\", \"Behavioral STAR method\"]','2026-02-15 13:35:39');
/*!40000 ALTER TABLE `interview_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interview_sessions`
--

DROP TABLE IF EXISTS `interview_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `role` varchar(120) NOT NULL,
  `difficulty` varchar(40) NOT NULL,
  `interview_type` varchar(60) NOT NULL,
  `duration_minutes` int NOT NULL,
  `total_questions` int NOT NULL,
  `answered_questions` int NOT NULL DEFAULT '0',
  `current_question_index` int NOT NULL DEFAULT '0',
  `score_total` decimal(6,2) NOT NULL DEFAULT '0.00',
  `status` varchar(20) NOT NULL DEFAULT 'in_progress',
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_sessions_user_id` (`user_id`),
  CONSTRAINT `fk_sessions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_sessions`
--

LOCK TABLES `interview_sessions` WRITE;
/*!40000 ALTER TABLE `interview_sessions` DISABLE KEYS */;
INSERT INTO `interview_sessions` VALUES (1,1,'santoshrajbgp11@gmail.com','medium','technical',10,5,1,2,8.00,'completed','2026-02-15 12:05:45','2026-02-15 13:35:39'),(2,1,'santoshrajbgp11@gmail.com','medium','technical',10,5,0,2,0.00,'in_progress','2026-02-15 13:10:00',NULL);
/*!40000 ALTER TABLE `interview_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'santoshrajbgp11@gmail.com','$2a$10$.5r5zHupfQ3Mem7r8IJ8MOaqaQuFukJdkXH/pzzBLJEdMCUSyjs5a','Santosh Kumar','2026-02-15 11:50:49','2026-02-15 11:50:49');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-15 19:37:40
