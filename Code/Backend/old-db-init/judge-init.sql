DROP TABLE IF EXISTS `judge`;

CREATE TABLE `judge` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `meetID` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (meetID) REFERENCES meet(id)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

LOCK TABLES `judge` WRITE;
INSERT INTO `judge` VALUES (0, 'Joe Beaver', 0);
UNLOCK TABLES;
