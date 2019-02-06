DROP TABLE IF EXISTS `player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `playerNum` int,
  `name` varchar NOT NULL,
  `team` varchar NOT NULL,
  `vaultScore` int,
  `barsScore` int,
  `beamScore` int,
  `floorScore` int,
  `AAScore` int,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

LOCK TABLES `reviews` WRITE;
INSERT INTO `reviews` VALUES (1, null, 'Mary Jacobsen', 'OSU', null, null, null, null, 40.0);
UNLOCK TABLES;
