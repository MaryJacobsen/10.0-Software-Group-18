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
