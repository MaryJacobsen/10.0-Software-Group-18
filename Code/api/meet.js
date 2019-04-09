const router = require('express').Router();
const validation = require('../lib/validation');
const { requireAuthentication, requireAdmin } = require('../lib/auth');

//schema for required and optional fields for a meet object

const meetSchema = {
  id: {required: false }, //medium int
  name: { required: true } //var char
};

/*
|-----------------------------------------------
| get meet
|-----------------------------------------------
| app.get('./meet/') gets all meets
|
*/

router.get('/', requireAdmin, function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    getMeets(mysqlPool)
    .then((meets) => {
      if (meets) {
        res.status(200).json(meets);
      } else {
          next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Unable to fetch meets.  Please try again later."
      });
    });
});

function getMeets(mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM meet', function (err, results) {
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
| Get meet by id
|-----------------------------------------------
| Gets meet by /:id
*/

router.get('/:id', requireAdmin, function (req, res, next) {
    const mysqlPool = req.app.locals.mysqlPool;
    const id = req.params.id;
    getMeetByID(id, mysqlPool)
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
        error: "Unable to fetch meet  Please try again later."
      });
    });
});

function getMeetByID(id, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('SELECT * FROM meet WHERE id = ?', [ id ], function (err, results) {
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
| Insert meet
|-----------------------------------------------
| app.post('./meet/ inserts a meet
|
*/

router.post('/', requireAdmin, function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  if (req.body && req.body.name) {
    insertNewMeet(req.body, mysqlPool)
      .then((id) => {
        res.status(201).json({
          id: id,
          links: {
            meet: '/meet/' + id
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Error inserting meet."
        });
        console.log(err);
      });
  } else {
    res.status(400).json({
      error: "Request needs a JSON body with a meet name"
    });
  }

});

function insertNewMeet(meet, mysqlPool) {
  return new Promise((resolve, reject) => {
    const meetValues = {
      id: null,
      name: meet.name
    };
    /*
    Check if meet exists
    */
    mysqlPool.query(
      'INSERT INTO meet SET ?',
      meetValues,
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
| Edit meet
|-----------------------------------------------
| Edit/Update a meet with /:meetID
|
*/

router.put('/:meetID', requireAdmin, function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const meetID = parseInt(req.params.meetID);
  if (validation.validateAgainstSchema(req.body, meetSchema)) {
    replaceMeetByID(meetID, req.body, mysqlPool)
      .then((updateSuccessful) => {
        if (updateSuccessful) {
          res.status(200).json({
            links: {
              meet: `/meet/${meetID}`
            }
          });
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "Unable to update specified meet.  Please try again later."
        });
      });
  } else {
    res.status(400).json({
      error: "Request body is not a valid meet object"
    });
  }
});

function replaceMeetByID(meetID, meet, mysqlPool) {
  return new Promise((resolve, reject) => {
    meet = validation.extractValidFields(meet, meetSchema);
    mysqlPool.query('UPDATE meet SET ? WHERE id = ?', [ meet, meetID ], function (err, result) {
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
| Deletes player with /:meetID
|
*/

router.delete('/:meetID', requireAdmin, function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const meetID = parseInt(req.params.meetID);
  deleteMeetByID(meetID, mysqlPool)
    .then((deleteSuccessful) => {
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to delete meet.  Please try again later."
      });
    });
});

function deleteMeetByID(meetID, mysqlPool) {
  return new Promise((resolve, reject) => {
    mysqlPool.query('DELETE FROM meet WHERE id = ?', [ meetID ], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });

}

exports.router = router;
