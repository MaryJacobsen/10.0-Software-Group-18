const router = require('express').Router();
const judge = require('./judge.js');
const team = require('./team.js');
const lineup = require('./lineup.js');

//Will serve the login page.
router.get('/', function(req, res, next) {
  res.render('loginPage');
});

//Another path that serves the login page
router.get('/login', function(req, res, next) {
  res.render('loginPage');
});

//Will serve createMeet page
router.get('/createmeet', function(req, res, next) {
  res.render('createMeetPage');
});

//Will serve Lineup page
router.get('/setlineup', function(req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  var meetID = 24;
  team.getTeamsByMeetID(meetID, mysqlPool)
  .then((teams) => {
    if (teams) {
      var templateArgs = {
        teams: teams
      };
      res.render('lineupPage', templateArgs);
    } else {
      var errorArgs = {
        statusCode: 204,
        err: "There is no current meet, please make sure a meet is set up before retrying this page"
      };
      res.status(204).render('errorPage', errorArgs);
    }
  })
  .catch((err) => {
    console.log(err);
    var errorArgs = {
      statusCode: 500,
      err: "The server broke attempting a dismount. Please try agiain later."
    };
    res.status(500).render('errorPage', errorArgs);
  });
});

//Will serve scoring page
router.get('/scoring', function(req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  var teams;
  var meetID = 24;
  team.getTeamsByMeetID(meetID, mysqlPool)
  .then((data) => {
    if (data) {
      teams = data;
      return judge.getJudgesByMeetID(meetID, mysqlPool)
    } else {
      var errorArgs = {
        statusCode: 204,
        err: "There is no current meet, please make sure a meet is set up before retrying this page"
      };
      res.status(204).render('errorPage', errorArgs);
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
      var errorArgs = {
        statusCode: 204,
        err: "There is no current meet, please make sure a meet is set up before retrying this page"
      };
      res.status(204).render('errorPage', errorArgs);
    }
  })
  .catch((err) => {
    console.log(err);
    var errorArgs = {
      statusCode: 500,
      err: "The server broke attempting a dismount. Please try agiain later."
    };
    res.status(500).render('errorPage', errorArgs);
  });
});

//Will serve dashboard
router.get('/dashboard', function(req, res, next){
  res.render('dashboard');
});

//Serves 404 page
router.get('*', function(req, res) {
  res.status(404).render('404Page');
});

exports.router = router;
