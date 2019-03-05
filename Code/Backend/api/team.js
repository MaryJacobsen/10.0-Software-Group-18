const router = require('express').Router();
const validation = require('../lib/validation');

//schema for required and optional fields for a team object

const teamSchema = {
  id: { required: true }, //mediumint
  teamScore: { required: true }, //decimal
  teamName: { required: true }, //varchar
  vaultScore: { required: false }, //decimal
  barsScore: { required: false }, //decimal
  beamScore: { required: false }, //decimal
  floorScore: { required: false }, //decimal
  meetID: { required: true } //mediumint
};

/*
|-----------------------------------------------
| Get team names
|-----------------------------------------------
| Gets all team names
|
*/

router.get('/', function (req, res, next) {
    // console.log("/team/teams");
    const mysqlPool = req.app.locals.mysqlPool;
    getTeams(mysqlPool)
    .then((teams) => {
      if (teams) {
        res.status(200).json(teams);
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

function getTeams(mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM team', function (err, results) {
      // console.log(results);
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
| Insert player
|-----------------------------------------------
| app.post('./player/ inserts a player
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
      error: "Request needs a JSON body with a team name"
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
  if (validation.validateAgainstSchema(req.body, teamSchema)) {
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
  } else {
    res.status(400).json({
      error: "Request body is not a valid team object"
    });
  }
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
| Delete player by ID
|-----------------------------------------------
| Deletes player with /:teamID
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
