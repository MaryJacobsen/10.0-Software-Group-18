const router = require('express').Router();
const validation = require('../lib/validation');
const bcrypt = require('bcryptjs');

const { generateAuthToken, requireAuthentication, requireAdmin } = require('../lib/auth');

//schema for required and optional fields for a meet object

const userSchema = {
  id: {required: false }, //medium int
  username: { required: true }, //var char
  auth: { required: false }, //medium int
  hash: { required: true }  // var char
};

router.get('/endSession', function(req, res) {
  req.meetSession.reset();
  res.redirect('/');
});

router.get('/getSession', function(req, res){
  res.status(200).json({
    meetSession: req.meetSession.currentMeet
  });
});

/* POST login auth*/
router.post('/login', function(req, res){
  const mysqlPool = req.app.locals.mysqlPool;
  if (req.body && req.body.username && req.body.password) {
    getUserByUsername(req.body.username, mysqlPool)
    .then((user) => {
      if(user){
        // return bcrypt.compare(req.body.password, user.hash);
        if (bcrypt.compareSync(req.body.password, user.hash)) {
          return user;
        }
      }else{
        return Promise.reject(401);
      }
    })
    .then((loginSuccessful) => {
        if (loginSuccessful) {
          return generateAuthToken(loginSuccessful.username, loginSuccessful.auth);
        } else {
          return Promise.reject(401);
        }
    })
    .then((token) => {
      if(req.meetSession.currentMeet != null)
      {
        let json = JSON.stringify({
          token: token,
          meetSession: req.meetSession.currentMeet
        });
        res.cookie('cookieName', json, { maxAge: 900000, httpOnly: false });
        res.status(200).json({
          success: "Login Successful."
        });
      }
      else {
        let json = JSON.stringify({
          token: token,
          meetSession: null
        });
        res.cookie('cookieName', json, { maxAge: 900000, httpOnly: false });
        res.status(200).json({
          success: "Login Successful."
        });
      }
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
