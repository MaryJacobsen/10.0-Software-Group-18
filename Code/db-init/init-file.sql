DROP TABLE IF EXISTS `meet`;

CREATE TABLE `meet` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

LOCK TABLES `meet` WRITE;
INSERT INTO `meet` VALUES (null, 'test meet');
UNLOCK TABLES;

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
  KEY `fk_meet_team` (`meetID`),

  CONSTRAINT `meet_fk_1`
  FOREIGN KEY (`meetID`)
  REFERENCES `meet`(`id`)
  ON UPDATE CASCADE
  ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

LOCK TABLES `team` WRITE, `meet` READ;
INSERT INTO `team` (`teamName`, `meetID`)
VALUES ('Oregon State University',
  (SELECT id FROM `meet` LIMIT 1));
UNLOCK TABLES;

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
  `meetID`mediumint(9),
  PRIMARY KEY (`id`),
  KEY `fk_team_player` (`teamID`),
  KEY `fk_meet_player` (`meetID`),

  CONSTRAINT `team_fk_1`
  FOREIGN KEY (`teamID`)
  REFERENCES `team`(`id`)
  ON UPDATE CASCADE
  ON DELETE NO ACTION,

  CONSTRAINT `meet_fk_2`
  FOREIGN KEY (meetID)
  REFERENCES meet(id)
  ON UPDATE CASCADE
  ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

LOCK TABLES `player` WRITE, `team` READ;
INSERT INTO `player` (`name`, `teamID`)
VALUES ('Mary Jacobsen',
  (SELECT id FROM team LIMIT 1));
UNLOCK TABLES;

DROP TABLE IF EXISTS `judge`;

CREATE TABLE `judge` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `meetID` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_meet_judge` (`meetID`),

  CONSTRAINT `meet_fk_3`
  FOREIGN KEY (`meetID`)
  REFERENCES `meet`(`id`)
  ON UPDATE CASCADE
  ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

LOCK TABLES `judge` WRITE, `meet` READ;
INSERT INTO `judge` (`name`, `meetID`)
VALUES ('Joe Beaver',
  (SELECT id FROM meet LIMIT 1));
UNLOCK TABLES;

DROP TABLE IF EXISTS `lineup`;

CREATE TABLE `lineup` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `playerID` mediumint(9) NOT NULL,
  `teamID` mediumint(9) NOT NULL,
  `order` mediumint(9) NOT NULL,
  `event` varchar(255) NOT NULL,
  `meetID` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_player_lineup` (`playerID`),
  KEY `fk_team_lineup` (`teamID`),
  KEY `fk_meet_lineup` (`meetID`),

  CONSTRAINT `player_fk_1`
  FOREIGN KEY (playerID)
  REFERENCES player(id)
  ON UPDATE CASCADE
  ON DELETE NO ACTION,

  CONSTRAINT `team_fk_2`
  FOREIGN KEY (teamID)
  REFERENCES team(id)
  ON UPDATE CASCADE
  ON DELETE NO ACTION,

  CONSTRAINT `meet_fk_4`
  FOREIGN KEY (`meetID`)
  REFERENCES `meet`(`id`)
  ON UPDATE CASCADE
  ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `score`;

CREATE TABLE `score` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `playerID` mediumint(9) NOT NULL,
  `judgeID` mediumint(9) NOT NULL,
  `score` DECIMAL(13,10) NOT NULL,
  `event` varchar(255) NOT NULL,
  `exhibition` mediumint(9) NOT NULL,
  `meetID` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_player_score` (`playerID`),
  KEY `fk_judge_score` (`judgeID`),
  KEY `fk_meet_score` (`meetID`),

  CONSTRAINT `player_fk_2`
  FOREIGN KEY (playerID)
  REFERENCES player(id)
  ON UPDATE CASCADE
  ON DELETE NO ACTION,

  CONSTRAINT `judge_fk_1`
  FOREIGN KEY (judgeID)
  REFERENCES judge(id)
  ON UPDATE CASCADE
  ON DELETE NO ACTION,

  CONSTRAINT `meet_fk_5`
  FOREIGN KEY (meetID)
  REFERENCES meet(id)
  ON UPDATE CASCADE
  ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

LOCK TABLES `score` WRITE, `meet` READ, `player` READ, `judge` READ;
INSERT INTO `score` (`playerID`, `judgeID`, `score`, `event`, `exhibition`, `meetID`)
VALUES ((SELECT `id` FROM `player` LIMIT 1),
  (SELECT `id` FROM `judge` LIMIT 1),
  10.0,
  'Vault',
  0,
  (SELECT `id` FROM `meet` LIMIT 1));
UNLOCK TABLES;
