const router = require('express').Router();
const validation = require('../lib/validation');

//schema for required and optional fields for a lineup object

const lineupSchema = {
  id: {required: true }, //medium int
  playerID: { required: true }, //medium int
  teamID: { required: true }, //medium int
  order: { required: true }, //medium int
  event: { required: true }, //varchar
  meetID: {required: true} //medium int
};

/*
|-----------------------------------------------
| Get lineup by event
|-----------------------------------------------
| Gets teams by /event/:/event
*/
router.get('/event/:event/:meetID', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const event = req.params.event;
    const meet = req.params.meetID;
    getLineupByEvent(event, meet, mysqlPool)
    .then((event) => {
      if (event) {
        res.status(200).json(event);
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

function getLineupByEvent(event, meet, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM lineup WHERE event = ? AND meetID = ?', [ event, meet ], function (err, results) {
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
| Insert player into lineup
|-----------------------------------------------
| app.post('./lineup/ inserts a player into a lineup position
|
*/

router.post('/', function (req, res, next) {
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

router.put('/:lineupID', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const lineupID = parseInt(req.params.lineupID);
  if (validation.validateAgainstSchema(req.body, lineupSchema)) {
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
  } else {
    res.status(400).json({
      error: "Request body is not a valid lineup object"
    });
  }
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

router.delete('/:lineupID', function (req, res, next) {
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
