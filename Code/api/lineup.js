const router = require('express').Router();
const validation = require('../lib/validation');

//schema for required and optional fields for a team object

const lineupSchema = {
  id: {required: true }, //medium int
  player: { required: true }, //varchar
  order: { required: true }, //int
  team: { required: true }, //varchar
  event: { required: true } //varchar
};

/*
|-----------------------------------------------
| Get Lineup by team & event
|-----------------------------------------------
| This function returns the lineup for :event
*/
router.get('/:team/:event', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    let team = req.params.team;
    let meetEvent = req.params.event;
    // console.log("Team: " + team + "\nEvent: " + meetEvent);
    getLineupByTeamEvent(team, meetEvent, mysqlPool)
    .then((teams) => {
      if (teams) {
        res.status(200).json(teams);
      } else {
          next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch teams.  Please try again later."
      });
    });
});

function getLineupByTeamEvent(team, meetEvent, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM lineup', function (err, results) {
      // console.log(results);
      if (err) {
        reject(err);
      } else {
        let orderedResults = [];
        for (var i = 0; i < results.length; i++) {
          //Find matching team
          if (results[i].team == team){
            //Find matching event
            if (results[i].event == meetEvent) {
              orderedResults.push(results[i])
            }
          }
        }
        orderedResults.sort(function(a, b){return a.order - b.order});
        resolve(orderedResults);
      }
    });
  });
};

/*
|-----------------------------------------------
| Insert a player into lineup
|-----------------------------------------------
| router.post('./lineup/ inserts a player into lineup
|
*/
router.post('/', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  console.log("request: " + req.body);
  if (req.body && req.body.event && req.body.team && req.body.order && req.body.player) {
    insertNewLineupPlayer(req.body, mysqlPool)
      .then((id) => {
        res.status(201).json({
          id: id,
          links: {
            lineup: '/lineup/' + id
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
      player: lineup.player,
      order: lineup.order,
      team: lineup.team,
      event: lineup.event
    };
    mysqlPool.query(
      'INSERT INTO lineup SET ?',
      lineupValues,
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

exports.router = router;
