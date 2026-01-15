-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: starAcademy
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `apprenti`
--

DROP TABLE IF EXISTS `apprenti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apprenti` (
  `idUtilisateur` int DEFAULT NULL,
  `idpromotion` int DEFAULT NULL,
  `identreprise` int DEFAULT NULL,
  `idma` int DEFAULT NULL,
  `idjury` int DEFAULT NULL,
  `idtp` int DEFAULT NULL,
  KEY `idUtilisateur` (`idUtilisateur`),
  KEY `idpromotion` (`idpromotion`),
  KEY `identreprise` (`identreprise`),
  KEY `idma` (`idma`),
  CONSTRAINT `apprenti_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`),
  CONSTRAINT `apprenti_ibfk_2` FOREIGN KEY (`idpromotion`) REFERENCES `promotion` (`idPromotion`),
  CONSTRAINT `apprenti_ibfk_3` FOREIGN KEY (`identreprise`) REFERENCES `entreprise` (`idEntreprise`),
  CONSTRAINT `apprenti_ibfk_4` FOREIGN KEY (`idma`) REFERENCES `maitreapprentissage` (`idUtilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apprenti`
--

LOCK TABLES `apprenti` WRITE;
/*!40000 ALTER TABLE `apprenti` DISABLE KEYS */;
INSERT INTO `apprenti` VALUES (1,1,1,1,1,1);
/*!40000 ALTER TABLE `apprenti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `idcontact` int DEFAULT NULL,
  `idalternant` int DEFAULT NULL,
  KEY `idUtilisateur_idx` (`idcontact`),
  KEY `idAlternant_fk_idx` (`idalternant`),
  CONSTRAINT `idAlternant_fk` FOREIGN KEY (`idalternant`) REFERENCES `apprenti` (`idUtilisateur`),
  CONSTRAINT `idContact_fk` FOREIGN KEY (`idcontact`) REFERENCES `utilisateur` (`idUtilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coordinatrice`
--

DROP TABLE IF EXISTS `coordinatrice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coordinatrice` (
  `idUtilisateur` int DEFAULT NULL,
  KEY `idUtilisateur` (`idUtilisateur`),
  CONSTRAINT `coordinatrice_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coordinatrice`
--

LOCK TABLES `coordinatrice` WRITE;
/*!40000 ALTER TABLE `coordinatrice` DISABLE KEYS */;
/*!40000 ALTER TABLE `coordinatrice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ecole`
--

DROP TABLE IF EXISTS `ecole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ecole` (
  `idEcole` int NOT NULL AUTO_INCREMENT,
  `nomEcole` varchar(50) DEFAULT NULL,
  `adresseEcole` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idEcole`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ecole`
--

LOCK TABLES `ecole` WRITE;
/*!40000 ALTER TABLE `ecole` DISABLE KEYS */;
/*!40000 ALTER TABLE `ecole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entreprise`
--

DROP TABLE IF EXISTS `entreprise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entreprise` (
  `idEntreprise` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) DEFAULT NULL,
  `siret` varchar(50) DEFAULT NULL,
  `adresse` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idEntreprise`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entreprise`
--

LOCK TABLES `entreprise` WRITE;
/*!40000 ALTER TABLE `entreprise` DISABLE KEYS */;
INSERT INTO `entreprise` VALUES (1,'Test',NULL,NULL);
/*!40000 ALTER TABLE `entreprise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evenement`
--

DROP TABLE IF EXISTS `evenement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evenement` (
  `idEvenement` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(200) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `lieu` varchar(100) DEFAULT NULL,
  `dateEvenement` date DEFAULT NULL,
  `typeEvenement` varchar(50) DEFAULT NULL,
  `heure` int DEFAULT NULL,
  `minutes` int DEFAULT NULL,
  PRIMARY KEY (`idEvenement`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evenement`
--

LOCK TABLES `evenement` WRITE;
/*!40000 ALTER TABLE `evenement` DISABLE KEYS */;
INSERT INTO `evenement` VALUES (1,'Test','Test','Test','2018-09-24','Test',NULL,NULL),(2,'Test','Test','Test','2018-09-24','Test',NULL,NULL),(3,'Test','Test','Test','2018-09-24','Test',12,9),(4,'Collégiale','Chanter avec tous les élèves de la promo','Colisée','2027-10-07','Concert',18,30),(5,'Duo','Chanter avec un autre élève','Place du marché','2027-08-06','Concert',12,0),(6,'Ecriture de paroles','Ecrire les paroles d\'une chanson à sortir','Studio de répétition','2027-09-01','Atelier',10,30),(7,'Epreuve de danse','Effectuer la chorégraphie apprise cette semaine','Salle de sport','2027-05-05','Atelier',14,15),(8,'Epreuve de chant','Chanter devant le jury','Studio','2027-05-07','Audition',9,0),(9,'Scène Ouverte','Préparer une chanson au choix à chanter durant la soirée','Bar de jeux','2027-06-21','Scène Ouverte',21,0),(10,'Intervention d\'une chanteuse connue','Racontera son parcours et donnera des conseils','AMphithéâtre','2027-10-01','Master Class',10,30),(11,'Entrainement de danse','Avec le prof de danse','Salle de sport','2027-01-10','Concert',11,0);
/*!40000 ALTER TABLE `evenement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jury`
--

DROP TABLE IF EXISTS `jury`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jury` (
  `idUtilisateur` int NOT NULL,
  KEY `idUtilisateur_idx` (`idUtilisateur`),
  CONSTRAINT `idUtilisateur` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jury`
--

LOCK TABLES `jury` WRITE;
/*!40000 ALTER TABLE `jury` DISABLE KEYS */;
INSERT INTO `jury` VALUES (1);
/*!40000 ALTER TABLE `jury` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `livrable`
--

DROP TABLE IF EXISTS `livrable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livrable` (
  `idLivrable` int NOT NULL AUTO_INCREMENT,
  `idapprenti` int DEFAULT NULL,
  `idPromotion` int DEFAULT NULL,
  `titre` varchar(200) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `dateOuverture` date DEFAULT NULL,
  `dateFermeture` date DEFAULT NULL,
  `idModele` int DEFAULT NULL,
  PRIMARY KEY (`idLivrable`),
  KEY `idPromotion` (`idPromotion`),
  CONSTRAINT `livrable_ibfk_1` FOREIGN KEY (`idPromotion`) REFERENCES `promotion` (`idPromotion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livrable`
--

LOCK TABLES `livrable` WRITE;
/*!40000 ALTER TABLE `livrable` DISABLE KEYS */;
/*!40000 ALTER TABLE `livrable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maitreapprentissage`
--

DROP TABLE IF EXISTS `maitreapprentissage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maitreapprentissage` (
  `idUtilisateur` int DEFAULT NULL,
  `identreprise` int DEFAULT NULL,
  KEY `idUtilisateur` (`idUtilisateur`),
  KEY `identreprise` (`identreprise`),
  CONSTRAINT `maitreapprentissage_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`),
  CONSTRAINT `maitreapprentissage_ibfk_2` FOREIGN KEY (`identreprise`) REFERENCES `entreprise` (`idEntreprise`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maitreapprentissage`
--

LOCK TABLES `maitreapprentissage` WRITE;
/*!40000 ALTER TABLE `maitreapprentissage` DISABLE KEYS */;
INSERT INTO `maitreapprentissage` VALUES (1,1);
/*!40000 ALTER TABLE `maitreapprentissage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `idNotification` int NOT NULL AUTO_INCREMENT,
  `idUtilisateur` int DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `descriptionCourte` varchar(1000) DEFAULT NULL,
  `lienIcone` varchar(1000) DEFAULT NULL,
  `lue` tinyint(1) DEFAULT NULL,
  `dateReception` datetime DEFAULT NULL,
  PRIMARY KEY (`idNotification`),
  KEY `idUtilisateur` (`idUtilisateur`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,1,'Long','Court',NULL,0,NULL),(2,1,'Long','Court',NULL,1,NULL);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professeur`
--

DROP TABLE IF EXISTS `professeur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professeur` (
  `idUtilisateur` int DEFAULT NULL,
  `idEcole` int DEFAULT NULL,
  KEY `idUtilisateur` (`idUtilisateur`),
  KEY `idEcole` (`idEcole`),
  CONSTRAINT `professeur_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`),
  CONSTRAINT `professeur_ibfk_2` FOREIGN KEY (`idEcole`) REFERENCES `ecole` (`idEcole`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professeur`
--

LOCK TABLES `professeur` WRITE;
/*!40000 ALTER TABLE `professeur` DISABLE KEYS */;
/*!40000 ALTER TABLE `professeur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `idPromotion` int NOT NULL AUTO_INCREMENT,
  `nomPromotion` varchar(50) DEFAULT NULL,
  `annee` int DEFAULT NULL,
  `idEcole` int DEFAULT NULL,
  PRIMARY KEY (`idPromotion`),
  KEY `idEcole` (`idEcole`),
  CONSTRAINT `promotion_ibfk_1` FOREIGN KEY (`idEcole`) REFERENCES `ecole` (`idEcole`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES (1,'Test',2020,NULL);
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referententreprise`
--

DROP TABLE IF EXISTS `referententreprise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referententreprise` (
  `idUtilisateur` int DEFAULT NULL,
  `idEntreprise` int DEFAULT NULL,
  KEY `idUtilisateur` (`idUtilisateur`),
  KEY `idEntreprise` (`idEntreprise`),
  CONSTRAINT `referententreprise_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`),
  CONSTRAINT `referententreprise_ibfk_2` FOREIGN KEY (`idEntreprise`) REFERENCES `entreprise` (`idEntreprise`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referententreprise`
--

LOCK TABLES `referententreprise` WRITE;
/*!40000 ALTER TABLE `referententreprise` DISABLE KEYS */;
/*!40000 ALTER TABLE `referententreprise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tuteur`
--

DROP TABLE IF EXISTS `tuteur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tuteur` (
  `idUtilisateur` int NOT NULL,
  KEY `idUtilisateur_idx` (`idUtilisateur`),
  KEY `idUtilisateur_tuteur_idx` (`idUtilisateur`),
  CONSTRAINT `idUtilisateur_Tuteur` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tuteur`
--

LOCK TABLES `tuteur` WRITE;
/*!40000 ALTER TABLE `tuteur` DISABLE KEYS */;
INSERT INTO `tuteur` VALUES (1);
/*!40000 ALTER TABLE `tuteur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `idUtilisateur` int NOT NULL AUTO_INCREMENT,
  `nomUtilisateur` varchar(100) DEFAULT NULL,
  `prenomUtilisateur` varchar(100) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `motDePasse` varchar(100) DEFAULT NULL,
  `idRole` int DEFAULT NULL,
  `telUtilisateur` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`idUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (1,'Test','Testo','test@test.fr','ee5990188fef7bca82a142eb08dc17068593e3bfab0a9caacf2705ac763b46e4',2,NULL),(8,'Tori','Oroto','nomail@mail.com','95e495d9c57d1e80d024e06eeef86b5a108f45454b19ee25110a4710d6f21389',5,NULL);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-12 11:22:41
