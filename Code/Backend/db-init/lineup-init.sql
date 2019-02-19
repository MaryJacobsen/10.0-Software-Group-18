DROP TABLE IF EXISTS `lineup`;

CREATE TABLE `lineup` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `playerID` mediumint(9) NOT NULL,
  `teamID` mediumint(9) NOT NULL,
  `order` mediumint(9) NOT NULL,
  `event` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (playerID) REFERENCES player(id),
  FOREIGN KEY (teamID) REFERENCES team(id)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

/*LOCK TABLES `lineup` WRITE;
INSERT INTO `lineup` VALUES (1, `Mary Jacobsen`, 1, `OSU`, `floor`);
UNLOCK TABLES;*/
