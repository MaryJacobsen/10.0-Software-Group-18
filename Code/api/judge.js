const router = require('express').Router();
const validation = require('../lib/validation');
const { requireAuthentication } = require('../lib/auth');

//schema for required and optional fields for a judge object

const judgeSchema = {
  id: {required: false }, //medium int
  name: { required: true }, //var char
  meetID: { required: true } //medium int
};

/*
|-----------------------------------------------
| Get all judges
|-----------------------------------------------
| gets all judges
|
*/
router.get('/', function (req, res, next) {
    // console.log("/team/teams");
    const mysqlPool = req.app.locals.mysqlPool;
    getJudges(mysqlPool)
    .then((judges) => {
      if (judges) {
        res.status(200).json(judges);
      } else {
          next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Unable to fetch judges.  Please try again later."
      });
    });
});

function getJudges(mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM judge', function (err, results) {
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
| Get judges by meetID
|-----------------------------------------------
| Gets all judges in :meetID
*/

router.get('/meet/:meetID', requireAuthentication, function (req, res, next) {
    console.log(" -- req.params:", req.params.meetID);
    const mysqlPool = req.app.locals.mysqlPool;
    const meetID = req.params.meetID;
    getJudgesByMeetID(meetID, mysqlPool)
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
        error: "Unable to fetch judges from meet with ID: " + id + " Please try again later."
      });
    });
});

function getJudgesByMeetID(id, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM judge WHERE meetID = ?', [ id ], function (err, results) {
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
| Insert judge
|-----------------------------------------------
| Inserts new judge (DOESN'T CHECK IF JUDGE ALREADY EXISTS)
|
*/

router.post('/', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  console.log("request: " + req.body.name + req.body.meetID)
  if (req.body && req.body.name && req.body.meetID) {
    insertNewJudge(req.body, mysqlPool)
      .then((id) => {
        res.status(201).json({
          id: id,
          links: {
            judge: '/judge/' + id
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Error inserting judge."
        });
        console.log(err);
      });
  } else {
    res.status(400).json({
      error: "Request needs a JSON body with a name and meetID"
    });
  }

});

function insertNewJudge(judge, mysqlPool) {
  return new Promise((resolve, reject) => {
    const judgeValues = {
      id: null,
      name: judge.name,
      meetID: judge.meetID
    };
    /*
    Check if team exists
    */
    mysqlPool.query(
      'INSERT INTO judge SET ?',
      judgeValues,
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
| Edit Judge
|-----------------------------------------------
| Edit/Update a judge with /:judgeID
|
*/

router.put('/:judgeID', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const id = parseInt(req.params.judgeID);
  if (validation.validateAgainstSchema(req.body, judgeSchema)) {
    replaceJudgeByID(id, req.body, mysqlPool)
      .then((updateSuccessful) => {
        if (updateSuccessful) {
          res.status(200).json({
            links: {
              judge: `/judge/${id}`
            }
          });
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "Unable to update specified judge.  Please try again later."
        });
      });
  } else {
    res.status(400).json({
      error: "Request body is not a valid judge object"
    });
  }
});

function replaceJudgeByID(id, judge, mysqlPool) {
  return new Promise((resolve, reject) => {
    judge = validation.extractValidFields(judge, judgeSchema);
    mysqlPool.query('UPDATE judge SET ? WHERE id = ?', [ judge, id ], function (err, result) {
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
| Delete judge by ID
|-----------------------------------------------
| Deletes judge with /:judgeID
|
*/

router.delete('/:judgeID', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const judgeID = parseInt(req.params.judgeID);
  deleteTeamByID(judgeID, mysqlPool)
    .then((deleteSuccessful) => {
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to delete judge.  Please try again later."
      });
    });
});

function deleteTeamByID(judgeID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('DELETE FROM judge WHERE id = ?', [ judgeID ], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });

}

exports.router = router;
