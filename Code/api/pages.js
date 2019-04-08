const router = require('express').Router();

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
  res.render('lineupPage');
});

//Will serve scoring page
router.get('/scoring', function(req, res, next) {
  res.render('scoringPage');
});

//Serves 404 page
router.get('*', function(req, res) {
  res.status(404).render('404Page');
});

exports.router = router;
