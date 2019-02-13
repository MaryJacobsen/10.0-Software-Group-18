const router = require('express').Router();
const validation = require('../lib/validation');

const playerSchema = {
  id: { required: true },
  playerNum: { required: false }, //int
  name: { required: true }, //vrachar
  team: { required: true }, //varchar
  vaultScore: { required: false }, //int
  barsScore: { required: false }, //int
  beamScore: { required: false }, //int
  floorScore: { required: false }, //int
  AAScore: { required: false } //int
};

/*
|-----------------------------------------------
| Get players
|-----------------------------------------------
| router.get('/:team'
*/
router.get('/:team', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const team = req.params.team;
    getPlayersByTeam(team, mysqlPool)
    .then((team) => {
      if (team) {
        res.status(200).json(team);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch players.  Please try again later."
      });
    });
});

function getPlayersByTeam(team, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT name FROM player WHERE team = ?', [ team ], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
    //console.log(name);
  });
};

/*
|-----------------------------------------------
| Get vault score by name (Should it be id instead of name?)
|-----------------------------------------------
| router.get('/:name/vault'
*/
router.get('/:name/vault', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const name = req.params.name;
    getVaultScoreByName(name, mysqlPool)
    .then((name) => {
      if (name) {
        res.status(200).json(name);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch name.  Please try again later."
      });
    });
});

function getVaultScoreByName(name, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT vaultScore FROM player WHERE name = ?', [ name ], function (err, results) {
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
| Get bars score by name (Should it be id instead of name?)
|-----------------------------------------------
| router.get('/:name/bars'
*/
router.get('/:name/bars', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const name = req.params.name;
    getBarsScoreByName(name, mysqlPool)
    .then((name) => {
      if (name) {
        res.status(200).json(name);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch name.  Please try again later."
      });
    });
});

function getBarsScoreByName(name, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT barsScore FROM player WHERE name = ?', [ name ], function (err, results) {
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
| Get beam score by name (Should it be id instead of name?)
|-----------------------------------------------
| router.get('/:name/beam'
*/
router.get('/:name/beam', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const name = req.params.name;
    getBeamScoreByName(name, mysqlPool)
    .then((name) => {
      if (name) {
        res.status(200).json(name);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch name.  Please try again later."
      });
    });
});

function getBeamScoreByName(name, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT beamScore FROM player WHERE name = ?', [ name ], function (err, results) {
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
| Get floor score by name (Should it be id instead of name?)
|-----------------------------------------------
| router.get('/:name/floor'
*/
router.get('/:name/floor', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const name = req.params.name;
    getFloorScoreByName(name, mysqlPool)
    .then((name) => {
      if (name) {
        res.status(200).json(name);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch name.  Please try again later."
      });
    });
});

function getFloorScoreByName(name, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT floorScore FROM player WHERE name = ?', [ name ], function (err, results) {
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
| Get AA score by name (Should it be id instead of name?)
|-----------------------------------------------
| router.get('/:name/AA'
*/
router.get('/:name/AA', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const name = req.params.name;
    getAAScoreByName(name, mysqlPool)
    .then((name) => {
      if (name) {
        res.status(200).json(name);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch name.  Please try again later."
      });
    });
});

function getAAScoreByName(name, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT AAScore FROM player WHERE name = ?', [ name ], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
    //console.log(name);
  });
};


function insertNewPlayer(player, mysqlPool) {
  return new Promise((resolve, reject) => {
    const playerValues = {
      id: null,
      playerNum: player.playerNum,
      name: player.name,
      team: player.team,
      vaultScore: player.vaultScore,
      barsScore: player.barsScore,
      beamScore: player.beamScore,
      floorScore: player.floorScore,
      AAScore: player.AAScore
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
| Insert player
|-----------------------------------------------
| router.post('./player/ inserts a player
|
*/
router.post('/', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  console.log("request: " + req.body.name)
  if (req.body && req.body.name && req.body.team) {
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
      error: "Request needs a JSON body with a name and a team"
    });
  }

});

/*
|-----------------------------------------------
| Edit player
|-----------------------------------------------
| Edit/Update a player with /:playerID
|
*/
router.put('/:playerName', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const playerName = req.params.playerName;
  // if (validation.validateAgainstSchema(req.body, playerSchema)) {
  getIDbyPlayerName(playerName, mysqlPool)
    .then((playerID) => {
      // console.log(playerID);
      replacePlayerByID(playerID, req.body, mysqlPool)
    })
    .then((updateSuccessful) => {
      console.log(updateSuccessful);
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
    console.log(playerID);
    mysqlPool.query('UPDATE player SET ? WHERE id = ?', [ player, playerID ], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(result.affectedRows > 0);
        resolve(result.affectedRows > 0);
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
| Delete player by ID
|-----------------------------------------------
| Deletes player with /:playerID
|
*/
router.delete('/:playerID', function (req, res, next) {
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
