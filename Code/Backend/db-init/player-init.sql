DROP TABLE IF EXISTS `player`;

CREATE TABLE `player` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `playerNum` mediumint(9),
  `name` varchar(255) NOT NULL,
  `teamID` mediumint(9) NOT NULL,
  `vaultScore` DECIMAL(13,10),
  `barsScore` DECIMAL(13,10),
  `beamScore` DECIMAL(13,10),
  `floorScore` DECIMAL(13,10),
  `AAScore` DECIMAL(13,10),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`teamID`) REFERENCES `team`(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

/*LOCK TABLES `player` WRITE;
INSERT INTO `player` VALUES (1, null, 'Mary Jacobsen', 'OSU', null, null, null, null, 40.0);
UNLOCK TABLES;*/
