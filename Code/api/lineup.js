const router = require('express').Router();
const validation = require('../lib/validation');
const { requireAuthentication, requireAdmin } = require('../lib/auth');

//schema for required and optional fields for a lineup object

const lineupSchema = {
  id: {required: false }, //medium int
  playerID: { required: true }, //medium int
  teamID: { required: true }, //medium int
  order: { required: true }, //medium int
  event: { required: true }, //varchar
  meetID: {required: true} //medium int
};

/*
|-----------------------------------------------
| Get lineup by meet, team, and event
|-----------------------------------------------
| Gets teams by /:meetID/:teamID/:event
*/
router.get('/:meetID/:teamID/:event/', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const meet = req.params.meetID;
    const team = req.params.teamID;
    const gymEvent = req.params.event;
    getLineupByEvent(meet, team, gymEvent, mysqlPool)
    .then((results) => {
      if (results) {
        res.status(200).json(results);
      } else {
          next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Unable to fetch lineup.  Please try again later."
      });
    });
});

function getLineupByEvent(meet, team, gymEvent, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM lineup WHERE meetID = ? AND teamID = ? AND event = ?', [ meet, team, gymEvent ], function (err, results) {
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
| Get lineup score (top 5)
|-----------------------------------------------
| Gets the average score of
| Returns: total score of top 5
*/

router.get('/score/:meetID/:teamID/:event', function (req, res, next) {
    console.log(" -- req.params:", req.params.teamID, req.params.event);
    const mysqlPool = req.app.locals.mysqlPool;
    const meetID = req.params.meetID;
    const teamID = req.params.teamID;
    const gymEvent = req.params.event;
    getTop5(meetID, teamID, gymEvent, mysqlPool)
    .then((playerScore) => {
      playerScore.sort(function(a, b){
        return b.score-a.score;
      })
      playerScore = playerScore.splice(0, 5);
      if (playerScore) {
        res.status(200).json(playerScore);
      } else {
          next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Unable to average scores for playerID: " + playerID + ". Please try again later."
      });
    });
});

function getTop5(meetID, teamID, gymEvent, mysqlPool) {
  let playerScore = [];
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM lineup WHERE meetID = ? AND event = ? AND teamID = ?', [ meetID, gymEvent, teamID ], function (err, result) {
      if (err) {
        reject(err);
      } else {
        // resolve(results);
        for (var x = 0; x < result.length; x++) {
          // playerIDs.push(results[x].playerID);
          mysqlPool.query('SELECT * FROM score WHERE meetID = ? AND playerID = ? AND event = ?', [ meetID, result[x].playerID, gymEvent ], function (err, results) {
            // console.log(results)
            if (err) {
              reject(err);
            } else {
              playerScore.push(results[0]);
              if(playerScore.length == result.length){
                resolve(playerScore);
              }
            }

          });
        }
      }
    });
  });
};

/*
|-----------------------------------------------
| Insert player into lineup
|-----------------------------------------------
| app.post('./lineup/ inserts a player into a lineup position
|
*/

router.post('/', requireAdmin, function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  if (req.body && req.body.playerID && req.body.teamID && req.body.order && req.body.event && req.body.meetID) {
    insertNewLineup(req.body, mysqlPool)
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
          error: "Error inserting lineup."
        });
        console.log(err);
      });
  } else {
    res.status(400).json({
      error: "Request needs a JSON body with a playerID, teamID, order, and event."
    });
  }

});

function insertNewLineup(lineup, mysqlPool) {
  return new Promise((resolve, reject) => {
    const lineupValues = {
      id: null,
      playerID: lineup.playerID,
      teamID: lineup.teamID,
      order: lineup.order,
      event: lineup.event,
      meetID: lineup.meetID
    };
    /*
    Check if lineup exists
    */
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

/*
|-----------------------------------------------
| Edit lineup
|-----------------------------------------------
| Edit/Update a lineup with /:lineupID
|
*/

router.put('/:lineupID', requireAdmin, function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const lineupID = parseInt(req.params.lineupID);
  replaceLineupByID(lineupID, req.body, mysqlPool)
    .then((updateSuccessful) => {
      if (updateSuccessful) {
        res.status(200).json({
          links: {
            lineup: `/lineup/${lineupID}`
          }
        });
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Unable to update specified lineup.  Please try again later."
      });
    });
});

function replaceLineupByID(lineupID, lineup, mysqlPool) {
  return new Promise((resolve, reject) => {
    team = validation.extractValidFields(lineup, lineupSchema);
    mysqlPool.query('UPDATE lineup SET ? WHERE id = ?', [ lineup, lineupID ], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });
}

/*
|-----------------------------------------------
| Delete player in lineup by ID
|-----------------------------------------------
| Deletes lineup row with /:lineupID
|
*/

router.delete('/:lineupID', requireAdmin, function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const lineupID = parseInt(req.params.lineupID);
  deleteLineupByID(lineupID, mysqlPool)
    .then((deleteSuccessful) => {
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to delete lineup entry.  Please try again later."
      });
    });
});

function deleteLineupByID(lineupID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('DELETE FROM lineup WHERE id = ?', [ lineupID ], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });

}

exports.router = router;
