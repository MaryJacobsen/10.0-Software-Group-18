DROP TABLE IF EXISTS `score`;

CREATE TABLE `score` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `playerID` mediumint(9) NOT NULL,
  `judgeID` mediumint(9) NOT NULL,
  `score` DECIMAL(13,10) NOT NULL,
  `event` varchar(255) NOT NULL,
  `exhibition` BIT NOT NULL,
  `meetID` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`playerID`) REFERENCES `player`(`id`),
  FOREIGN KEY (`judgeID`) REFERENCES `judge`(`id`),
  FOREIGN KEY (`meetID`) REFERENCES `meet`(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

LOCK TABLES `score` WRITE;
INSERT INTO `score` VALUES (0, 0, 0, 10.0, 'Vault', null, 0);
UNLOCK TABLES;
