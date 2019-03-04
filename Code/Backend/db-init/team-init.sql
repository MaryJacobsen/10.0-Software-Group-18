DROP TABLE IF EXISTS `team`;

CREATE TABLE `team` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `teamScore` DECIMAL(13,10),
  `teamName` varchar(255) NOT NULL,
  `vaultScore` DECIMAL(13,10),
  `barsScore` DECIMAL(13,10),
  `beamScore` DECIMAL(13,10),
  `floorScore` DECIMAL(13,10),
  `meetID` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (meetID) REFERENCES meet(id)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

LOCK TABLES `team` WRITE;
INSERT INTO `team` VALUES (0, null, 'Oregon State University', null, null, null, null, 0);
UNLOCK TABLES;
