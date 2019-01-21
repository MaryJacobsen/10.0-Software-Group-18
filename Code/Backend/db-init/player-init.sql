DROP TABLE IF EXISTS `player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `playerNum` int NOT NULL,
  `team` varchar NOT NULL,
  `vaultScore` int,
  `barsScore` int,
  `beamScore` int,
  `floorScore` int,
  `AAScore` int,
  `vaultEx` tinyint(1) NOT NULL,
  `barsEx` tinyint(1) NOT NULL,
  `beamEx` tinyint(1) NOT NULL,
  `floorEx` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_playerNum` (`playerNum`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
