DROP TABLE IF EXISTS `team`;

CREATE TABLE `team` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `teamScore` DECIMAL(13,10),
  `teamName` varchar(255) NOT NULL,
  `vaultScore` DECIMAL(13,10),
  `barsScore` DECIMAL(13,10),
  `beamScore` DECIMAL(13,10),
  `floorScore` DECIMAL(13,10),
  PRIMARY KEY (`id`),
  KEY `idx_teamName` (`teamName`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

LOCK TABLES `team` WRITE;
INSERT INTO `team` VALUES (1, null, 'Oregon State University', null, null, null, null),
  (2, null, 'University of Washington', null, null, null, null),
  (3, null, 'University of California Los Angeles', null, null, null, null),
  (4, null, 'University of Utah', null, null, null, null);
UNLOCK TABLES;
