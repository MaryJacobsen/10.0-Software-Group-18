DROP TABLE IF EXISTS `team`;

CREATE TABLE `team` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `teamScore` DECIMAL(13,10),
  `vaultScore` DECIMAL(13,10),
  `barsScore` DECIMAL(13,10),
  `beamScore` DECIMAL(13,10),
  `floorScore` DECIMAL(13,10),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
