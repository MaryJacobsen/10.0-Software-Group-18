const router = require('express').Router();
const validation = require('../lib/validation');
const { requireAuthentication, requireAdmin } = require('../lib/auth');

const playerSchema = {
  id: { required: false }, //mediumint
  playerNum: { required: false }, //int
  name: { required: true }, //vrachar
  teamID: { required: true }, //mediumint
  vaultScore: { required: false }, //decimal
  barsScore: { required: false }, //decimal
  beamScore: { required: false }, //decimal
  floorScore: { required: false }, //decimal
  AAScore: { required: false }, //decimal
  meetID: { required: true } //medium int
};

/*
|-----------------------------------------------
| Get players on team
|-----------------------------------------------
| router.get('/:meetID/:teamID')
*/
router.get('/:meetID/:teamID', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const teamID = req.params.teamID;
    const meetID = req.params.meetID;
    getPlayersByTeam(teamID, meetID, mysqlPool)
    .then((players) => {
      if (players) {
        res.status(200).json(players);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch players on team with ID: " + teamID + ". Please try again later."
      });
    });
});

function getPlayersByTeam(teamID, meetID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM player WHERE meetID = ? AND teamID = ?', [ meetID, teamID ], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

/*
|-----------------------------------------------
| Get player by id
|-----------------------------------------------
| router.get('/:playerID')
*/
router.get('/:playerID', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const playerID = req.params.playerID;
    getPlayerByID(playerID, mysqlPool)
    .then((player) => {
      if (player) {
        res.status(200).json(player);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch player with ID: " + playerID + ". Please try again later."
      });
    });
});

function getPlayerByID(playerID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM player WHERE id = ? LIMIT 1', [ playerID ], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

/*
|-----------------------------------------------
| Get vault score by playerID, event, and meetID
|-----------------------------------------------
| router.get('/:meet/:name/vault')
*/
router.get('/:playerID/vault', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const player = req.params.playerID;
    getVaultScoreByID(player, mysqlPool)
    .then((player) => {
      if (player) {
        res.status(200).json(player);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch vault score.  Please try again later."
      });
    });
});

function getVaultScoreByID(player, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT vaultScore FROM player WHERE id = ?', [ player ], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
    //console.log(name);
  });
};

/*
|-----------------------------------------------
| Get bars score by id
|-----------------------------------------------
| router.get('/:playerID/bars'
*/
router.get('/:playerID/bars', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const player = req.params.playerID;
    getBarsScoreByID(player, mysqlPool)
    .then((player) => {
      if (player) {
        res.status(200).json(player);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch bars score.  Please try again later."
      });
    });
});

function getBarsScoreByID(player, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT barsScore FROM player WHERE id = ?', [ player ], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

/*
|-----------------------------------------------
| Get beam score by id
|-----------------------------------------------
| router.get('/:playerID/beam'
*/
router.get('/:playerID/beam', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const player = req.params.playerID;
    getBeamScoreByID(player, mysqlPool)
    .then((player) => {
      if (player) {
        res.status(200).json(player);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch beam score.  Please try again later."
      });
    });
});

function getBeamScoreByID(player, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT beamScore FROM player WHERE id = ?', [ player ], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

/*
|-----------------------------------------------
| Get floor score by id
|-----------------------------------------------
| router.get('/:playerID/floor'
*/
router.get('/:playerID/floor', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const player = req.params.playerID;
    getFloorScoreByID(player, mysqlPool)
    .then((player) => {
      if (player) {
        res.status(200).json(player);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch floor score.  Please try again later."
      });
    });
});

function getFloorScoreByID(player, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT floorScore FROM player WHERE id = ?', [ player ], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
    //console.log(name);
  });
};

/*
|-----------------------------------------------
| Get AA score by id
|-----------------------------------------------
| router.get('/:playerID/AA'
*/
router.get('/:playerID/AA', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const player = req.params.playerID;
    getAAScoreByID(player, mysqlPool)
    .then((player) => {
      if (player) {
        res.status(200).json(player);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch AA score.  Please try again later."
      });
    });
});

function getAAScoreByID(player, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT AAScore FROM player WHERE id = ?', [ player ], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
    //console.log(name);
  });
};

/*
|-----------------------------------------------
| Insert player
|-----------------------------------------------
| router.post('./player/ inserts a player
|
*/
router.post('/', requireAdmin, function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  console.log("request: " + req.body.name + req.body.teamID)
  if (req.body && req.body.name && req.body.teamID && req.body.meetID) {
    insertNewPlayer(req.body, mysqlPool)
      .then((id) => {
        res.status(201).json({
          id: id,
          links: {
            player: '/player/' + id
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Error inserting player."
        });
        console.log(err);
      });
  } else {
    res.status(400).json({
      error: "Request needs a JSON body with a name and a teamID"
    });
  }

});

function insertNewPlayer(player, mysqlPool) {
  return new Promise((resolve, reject) => {
    const playerValues = {
      id: null,
      playerNum: player.playerNum,
      name: player.name,
      teamID: player.teamID,
      vaultScore: player.vaultScore,
      barsScore: player.barsScore,
      beamScore: player.beamScore,
      floorScore: player.floorScore,
      AAScore: player.AAScore,
      meetID: player.meetID
    };
    mysqlPool.query(
      'INSERT INTO player SET ?',
      playerValues,
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
}

/*
|-----------------------------------------------
| Edit player
|-----------------------------------------------
| Edit/Update a player with /:playerID
|
*/
router.put('/:playerName', requireAdmin, function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const playerName = req.params.playerName;
  // if (validation.validateAgainstSchema(req.body, playerSchema)) {
  getIDbyPlayerName(playerName, mysqlPool)
    .then((playerID) => {
      return replacePlayerByID(playerID, req.body, mysqlPool)
    })
    .then((updateSuccessful) => {
      if (updateSuccessful) {
        res.status(200).json({
          links: {
            player: `/player/${playerName}`
          }
        });
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      if (err == 404) {
        res.status(404).json({
          error: "Player name not found."
        });
      }
      res.status(500).json({
        error: "Unable to update specified player.  Please try again later."
      });
    });
  // } else {
  //   res.status(400).json({
  //     error: "Request body is not a valid player object"
  //   });
  // }
});

function replacePlayerByID(playerID, player, mysqlPool) {
  return new Promise((resolve, reject) => {
    player = validation.extractValidFields(player, playerSchema);
    mysqlPool.query('UPDATE player SET ? WHERE id = ?', [ player, playerID ], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function getIDbyPlayerName(name, mysqlPool){
  return new Promise((resolve, reject) => {
    // console.log("getIDbyPlayerName");
    mysqlPool.query('SELECT * FROM player', function (err, result) {
      if (err) {
        reject(err);
      } else {
        for (var i = 0; i < result.length; i++) {
          // console.log(result[i].name);
          if(result[i].name == name){
            // console.log(result[i].id);
            resolve(result[i].id);
          }
        }
        reject(404);
      }
    });
  });
}

/*
|-----------------------------------------------
| DELETE
|-----------------------------------------------
*/

/*
|-----------------------------------------------
| Delete player by ID
|-----------------------------------------------
| Deletes player with /:playerID
|
*/
router.delete('/:playerID', requireAdmin, function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const playerID = parseInt(req.params.playerID);
  deletePlayerByID(playerID, mysqlPool)
    .then((deleteSuccessful) => {
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to delete player.  Please try again later."
      });
    });
});

function deletePlayerByID(playerID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('DELETE FROM player WHERE id = ?', [ playerID ], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });

}

exports.router = router;
