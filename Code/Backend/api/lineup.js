const router = require('express').Router();
const validation = require('../lib/validation');

//schema for required and optional fields for a lineup object

const lineupSchema = {
  id: {required: true }, //medium int
  playerID: { required: true }, //medium int
  teamID: { required: true },
  order: { required: true }, //int
  event: { required: true } //varchar
};

/*
|-----------------------------------------------
| Get Lineup by event
|-----------------------------------------------
| This function returns the lineup for :event
*/

/*
|-----------------------------------------------
| Insert a player into lineup
|-----------------------------------------------
| router.post('./lineup/ inserts a player into lineup
|
*/
/*router.post('/', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  console.log("request: " + req.body.name)
  if (req.body && req.body.event && req.body.team && req.body.order && req.body.player) {
    insertNewLineupPlayer(req.body, mysqlPool)
      .then((id) => {
        res.status(201).json({
          id: id,
          links: {
            player: '/lineup/' + id
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Error inserting player into lineup."
        });
        console.log(err);
      });
  } else {
    res.status(400).json({
      error: "Request needs a JSON body with a player, a team, an order, and an event"
    });
  }

});

function insertNewLineupPlayer(lineup, mysqlPool) {
  return new Promise((resolve, reject) => {
    const lineupValues = {
      id: null,
      player: player.player,
      order: player.order,
      team: player.team,
      event: player.event
    };
    mysqlPool.query(
      'INSERT INTO lineup SET ?',
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
}*/

exports.router = router;
