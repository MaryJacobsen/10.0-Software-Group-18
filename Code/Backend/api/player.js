const router = require('express').Router();
//const validation = require('../lib/validation');

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
| Dont know what this is for yet
|-----------------------------------------------
| stuff.
*/
router.get('/:name', function (req, res, next) {
    //console.log(" -- req.params:", req.params.teamName);
    const mysqlPool = req.app.locals.mysqlPool;
    const name = req.params.name;
    getScoreByName(name, mysqlPool)
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

function getScoreByName(name, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM player WHERE id = ?', [ 1 ], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
    console.log(name);
  });
};

function insertNewPlayer(player) {
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
| app.post('./player/ inserts a player
|
*/
router.post('/', function (req, res, next) {
  console.log("request: " + req.body.name)
  if (req.body && req.body.name && req.body.team) {
    insertNewPlayer(req.body)
      .then((id) => {
        res.status(201).json({
          id: id,
          links: {
            player: '/player/' + id//,
          //  name: req.body.name,
          //  team: req.body.name
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Error inserting player."
        });
      });
  } else {
    res.status(400).json({
      error: "Request needs a JSON body with a name and a team"
    });
  }

});

exports.router = router;
