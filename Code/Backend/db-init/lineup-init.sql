DROP TABLE IF EXISTS `lineup`;

CREATE TABLE `lineup` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  'player' varchar NOT NULL,
  `order` int NOT NULL,
  `team` varchar NOT NULL,
  `event` varchar,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
