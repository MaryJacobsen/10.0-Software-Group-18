const router = require('express').Router();
const validation = require('../lib/validation');
const bcrypt = require('bcryptjs');

const { generateAuthToken, requireAuthentication } = require('../lib/auth');

//schema for required and optional fields for a meet object

const userSchema = {
  id: {required: false }, //medium int
  username: { required: true }, //var char
  auth: { required: false }, //medium int
  hash: { required: true }  // var char
};



/* POST login auth*/
router.post('/login', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  if (req.body && req.body.username && req.body.password) {
    getUserByUsername(req.body.username, mysqlPool)
    .then((user) => {
      if(user){
        console.log(user);
        return bcrypt.compare(req.body.password, user.hash);
      }else{
        return Promise.reject(401);
      }
    })
    .then((loginSuccessful) => {
        if (loginSuccessful) {
          return generateAuthToken(req.body.username);
        } else {
          return Promise.reject(401);
        }
    })
    .then((token) => {
      res.status(200).json({
        token: token
      });
    })
    .catch((err) => {
        console.log(err);
        if (err === 401) {
          res.status(401).json({
            error: "Invalid Credentials."
          });
        } else {
          res.status(500).json({
            error: "Failed to validate login. Please try again later."
          });
        }
      });
  } else {
    res.status(400).json({
      error: "Request needs a user ID and Password."
    });
  }
});

function getUserByUsername(username, mysqlPool){
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM user WHERE username = ?',
      [ username ],
      function (err, results) {
        console.log(results);
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

exports.router = router;
