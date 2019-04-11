const router = require('express').Router();
const validation = require('../lib/validation');

//schema for required and optional fields for a team object

const teamSchema = {
  id: { required: false }, //mediumint
  teamScore: { required: false }, //decimal
  teamName: { required: true }, //varchar
  vaultScore: { required: false }, //decimal
  barsScore: { required: false }, //decimal
  beamScore: { required: false }, //decimal
  floorScore: { required: false }, //decimal
  meetID: { required: true } //mediumint
};

/*
|-----------------------------------------------
| Get all teams in a meet
|-----------------------------------------------
| Gets teams by /:meetID/meet
*/
router.get('/:meetID/meet', function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const meetID = req.params.meetID;
    getTeamsByMeetID(meetID, mysqlPool)
    .then((meetID) => {
      if (meetID) {
        res.status(200).json(meetID);
      } else {
          next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Unable to fetch teams.  Please try again later."
      });
    });
});

function getTeamsByMeetID(meetID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM team WHERE meetID = ?', [ meetID ], function (err, results) {
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
| Get team by ID
|-----------------------------------------------
| Gets team name by /:id
*/

router.get('/:id', function (req, res, next) {
    console.log(" -- req.params:", req.params.id);
    const mysqlPool = req.app.locals.mysqlPool;
    const id = req.params.id;
    getTeamByID(id, mysqlPool)
    .then((id) => {
      if (id) {
        res.status(200).json(id);
      } else {
          next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Unable to fetch team.  Please try again later."
      });
    });
});

function getTeamByID(id, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM team WHERE id = ?', [ id ], function (err, results) {
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
| Get total team score so far by ID
|-----------------------------------------------
| Gets team score by /:id
*/

router.get('/score/:id', function (req, res, next) {
    console.log(" -- req.params:", req.params.id);
    const mysqlPool = req.app.locals.mysqlPool;
    const id = req.params.id;

    getTeamByID(id, mysqlPool)
    .then((scores) => {
      let total = 0;
      if(scores.vaultScore != null) {
        total += scores.vaultScore;
      }
      if(scores.barsScore != null) {
        total += scores.barsScore;
      }
      if(scores.beamScore != null) {
        total += scores.beamScore;
      }
      if(scores.floorScore != null) {
        total += scores.floorScore;
      }
      if (total) {
        res.status(200).json(total);
      } else {
          next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Unable to fetch team score.  Please try again later."
      });
    });
});

function getTeamByID(id, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM team WHERE id = ?', [ id ], function (err, results) {
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
| Insert team
|-----------------------------------------------
| app.post('./team/ inserts a team
|
*/

router.post('/', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  console.log("request: " + req.body.teamName + req.body.meetID)
  if (req.body && req.body.teamName && req.body.meetID) {
    insertNewTeam(req.body, mysqlPool)
      .then((id) => {
        res.status(201).json({
          id: id,
          links: {
            team: '/team/' + id
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Error inserting team."
        });
        console.log(err);
      });
  } else {
    res.status(400).json({
      error: "Request needs a JSON body with a teamName and meetID"
    });
  }

});

function insertNewTeam(team, mysqlPool) {
  return new Promise((resolve, reject) => {
    const teamValues = {
      id: null,
      teamScore: team.teamScore,
      teamName: team.teamName,
      vaultScore: team.vaultScore,
      barsScore: team.barsScore,
      beamScore: team.beamScore,
      floorScore: team.floorScore,
      meetID: team.meetID
    };
    /*
    Check if team exists
    */
    mysqlPool.query(
      'INSERT INTO team SET ?',
      teamValues,
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
| Edit Team
|-----------------------------------------------
| Edit/Update a team with /:teamID
|
*/

router.put('/:teamID', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const teamID = parseInt(req.params.teamID);
  replaceTeamByID(teamID, req.body, mysqlPool)
    .then((updateSuccessful) => {
      if (updateSuccessful) {
        res.status(200).json({
          links: {
            team: `/team/${teamID}`
          }
        });
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Unable to update specified team.  Please try again later."
      });
    });
});

function replaceTeamByID(teamID, team, mysqlPool) {
  return new Promise((resolve, reject) => {
    team = validation.extractValidFields(team, teamSchema);
    mysqlPool.query('UPDATE team SET ? WHERE id = ?', [ team, teamID ], function (err, result) {
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
| Delete team by ID
|-----------------------------------------------
| Deletes team with /:teamID
|
*/

router.delete('/:teamID', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const teamID = parseInt(req.params.teamID);
  deleteTeamByID(teamID, mysqlPool)
    .then((deleteSuccessful) => {
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to delete team.  Please try again later."
      });
    });
});

function deleteTeamByID(teamID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('DELETE FROM team WHERE id = ?', [ teamID ], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });

}

exports.router = router;
exports.getTeamsByMeetID = getTeamsByMeetID
