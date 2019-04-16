const router = require('express').Router();
const judge = require('./judge.js');
const team = require('./team.js');
const lineup = require('./lineup.js');
const { checkAuthToken, requireAuthentication, requireAdmin } = require('../lib/auth');

//Will serve the login page.
router.get('/', function(req, res, next) {
  res.redirect('/dashboard');
});

//Another path that serves the login page
router.get('/login', function(req, res, next) {
  res.render('loginPage');
});

router.get('/export', function(req, res, next) {
  res.render('export');
});
//Will serve createMeet page
router.get('/createmeet', function(req, res, next) {
  if (req.cookies.credentials) {
    var cookie = JSON.parse(req.cookies.credentials);

    checkAuthToken(cookie.token, 1)
    .then(() => {
      res.render('createMeetPage');
    })
    .catch((err) => {
      console.log(err);
      if (err == 403) {
        var errorArgs = {
          statusCode: 403,
          err: "Invalid account level"
        }
        res.status(403).render('errorPage', errorArgs);
      }
    });
  } else {
    res.redirect('/login');
  }
});

//Will serve Lineup page
router.get('/setlineup', function(req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  if (req.cookies.credentials) {
    var cookie = JSON.parse(req.cookies.credentials);

    checkAuthToken(cookie.token, 1)
    .then(() => {
      var meetID = req.meetSession.currentMeet;
      console.log(req.meetSession.currentMeet);
      if (meetID != undefined) {
        return team.getTeamsByMeetID(meetID, mysqlPool)
      } else {
        return Promise.reject(204);
      }
    })
    .then((teams) => {
      if (teams) {
        var templateArgs = {
          teams: teams
        };
        res.render('lineupPage', templateArgs);
      } else {
        return Promise.reject(204);
      }
    })
    .catch((err) => {
      console.log(err);
      if (err == 403) {
        var errorArgs = {
          statusCode: 403,
          err: "Invalid account level"
        };
        res.status(403).render('errorPage', errorArgs);
      } else if (err == 204) {
        var errorArgs = {
          statusCode: 204,
          err: "There is no current meet, please make sure a meet is set up before retrying this page"
        };
        console.log("Inside 204 error");
        res.render('errorPage', errorArgs);
      } else {
        var errorArgs = {
          statusCode: 500,
          err: "The server broke attempting a dismount. Please try agiain later."
        };
        res.status(500).render('errorPage', errorArgs);
      }
    });
  } else {
    res.redirect('/login');
  }
});

//Will serve scoring page
router.get('/scoring', function(req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  var data;
  var meetID;
  if (req.cookies.credentials) {
    var cookie = JSON.parse(req.cookies.credentials);
    checkAuthToken(cookie.token, 0)
    .then(() => {
      meetID = req.meetSession.currentMeet;
      console.log(req.meetSession.currentMeet);
      if (meetID != undefined) {
        return team.getTeamsByMeetID(meetID, mysqlPool)
      } else {
        return Promise.reject(204);
      }
    })
    .then((data) => {
      if (data) {
        teams = data;
        return judge.getJudgesByMeetID(meetID, mysqlPool)
      } else {
        return Promise.reject(204);
      }
    })
    .then((judges) => {
      if (judges) {
        var templateArgs = {
          teams: teams,
          judges: judges
        };
        res.render('scoringPage', templateArgs);
      } else {
        return Promise.reject(204);
      }
    })
    .catch((err) => {
      console.log(err);
      if (err == 204) {
        var errorArgs = {
          statusCode: 204,
          err: "There is no current meet, please make sure a meet is set up before retrying this page"
        };
        console.log("Inside 204 error");
        res.render('errorPage', errorArgs);
      } else {
        var errorArgs = {
          statusCode: 500,
          err: "The server broke attempting a dismount. Please try agiain later."
        };
        res.status(500).render('errorPage', errorArgs);
      }
    });
  } else {
    res.redirect('/login');
  }
});

//Will serve dashboard
router.get('/dashboard', function(req, res, next){
  if (req.cookies.credentials) {
    var cookie = JSON.parse(req.cookies.credentials);

    checkAuthToken(cookie.token, 0)
    .then(() => {
      res.render('dashboard');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/login');
    });
  } else {
    res.redirect('/login');
  }
});

//Serves 404 page
router.get('*', function(req, res) {
  res.status(404).render('404Page');
});

exports.router = router;
