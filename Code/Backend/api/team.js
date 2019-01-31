const router = require('express').Router();
//const validation = require('../lib/validation');

//schema for required and optional fields for a team object

const teamSchema = {
  teamScore: { required: true }, //int
  teamName: { required: true }, //varchar
  vaultScore: { required: false }, //int
  barsScore: { required: false }, //int
  beamScore: { required: false }, //int
  floorScore: { required: false } //int
};

/*
|-----------------------------------------------
| Team Score
|-----------------------------------------------
| router.get('./team/:teamName', ...) returns the team score
| that :teamName has
*/
router.get('/:teamName', function (req, res, next) {
    //console.log(" -- req.params:", req.params.teamName);
    const mysqlPool = req.app.locals.mysqlPool;
    const teamName = req.params.teamName;
    getScoreByName(teamName, mysqlPool)
  //  .then((teamScore) => {
      if (teamName) {
        res.status(200).json(teamName);
      } else {
        res.status(500).json({
          error: "Unable to fetch teamScore.  Please try again later."
        });
      }
    //})
    //.catch((err) => {

    //});
});

function getScoreByName(teamName, mysqlPool) {
//  return new Promise((resolve, reject) => {
    console.log("Team score of " + teamName);
  //});
};

/*
|------------------------------------------------------------
| Team Vault Score
|------------------------------------------------------------
| router.get('./team/vault/:teamName', ...) returns the team
| vault score that :teamName has
*/
router.get('/vault/:teamName', function (req, res, next) {
    // console.log(" -- req.params:", req.params);
    const mysqlPool = req.app.locals.mysqlPool;
    const teamName = req.params.teamName;
    getTeamVaultScoreByName(teamName, mysqlPool)
  //  .then((teamScore) => {
      if (teamName) {
        res.status(200).json(teamName);
      } else {
        res.status(500).json({
          error: "Unable to fetch vaultScore.  Please try again later."
        });
      }
    //})
    //.catch((err) => {

    //});
});

function getTeamVaultScoreByName(teamName, mysqlPool) {
//  return new Promise((resolve, reject) => {
    console.log("Vault score of " + teamName);
  //});
};

/*
|------------------------------------------------------------
| Team Bars Score
|------------------------------------------------------------
| router.get('./team/bars/:teamName', ...) returns the team
| bars score that :teamName has
*/
router.get('/bars/:teamName', function (req, res, next) {
    // console.log(" -- req.params:", req.params);
    const mysqlPool = req.app.locals.mysqlPool;
    const teamName = req.params.teamName;
    getTeamBarsScoreByName(teamName, mysqlPool)
    // .then((teamScore) => {
      if (teamName) {
        res.status(200).json(teamName);
      } else {
        res.status(500).json({
          error: "Unable to fetch vaultScore.  Please try again later."
        });
      }
    //})
    //.catch((err) => {

    //});
});

function getTeamBarsScoreByName(teamName, mysqlPool) {
//  return new Promise((resolve, reject) => {
    console.log("Bars score of " + teamName);
  //});
};

/*
|------------------------------------------------------------
| Team Beam Score
|------------------------------------------------------------
| router.get('./team/beam/:teamName', ...) returns the team
| vault score that :teamName has
*/
router.get('/beam/:teamName', function (req, res, next) {
    // console.log(" -- req.params:", req.params);
    const mysqlPool = req.app.locals.mysqlPool;
    const teamName = req.params.teamName;
    getTeamBeamScoreByName(teamName, mysqlPool)
  //  .then((teamScore) => {
      if (teamName) {
        res.status(200).json(teamName);
      } else {
        res.status(500).json({
          error: "Unable to fetch vaultScore.  Please try again later."
        });
      }
    //})
    //.catch((err) => {

    //});
});

function getTeamBeamScoreByName(teamName, mysqlPool) {
  //return new Promise((resolve, reject) => {
    console.log("Beam score of " + teamName);
  //});
};

/*
|------------------------------------------------------------
| Team Floor Score
|------------------------------------------------------------
| router.get('./team/vault/:teamName', ...) returns the team
| vault score that :teamName has
*/
router.get('/floor/:teamName', function (req, res, next) {
    // console.log(" -- req.params:", req.params);
    const mysqlPool = req.app.locals.mysqlPool;
    const teamName = req.params.teamName;
    getTeamFloorScoreByName(teamName, mysqlPool)
  //  .then((teamScore) => {
      if (teamName) {
        res.status(200).json(teamName);
      } else {
        res.status(500).json({
          error: "Unable to fetch floorScore.  Please try again later."
        });
      }
    //})
    //.catch((err) => {

    //});
});

function getTeamFloorScoreByName(teamName, mysqlPool) {
//  return new Promise((resolve, reject) => {
    console.log("Floor score of " + teamName);
  //});
};

/*
|-----------------------------------------------
| Hail Mary
|-----------------------------------------------
| router.get('./team/', ...) will return scores
| for all teams
*/
router.get('/', function (req, res, next) {
    // console.log(" -- req.params:", req.params);
    const mysqlPool = req.app.locals.mysqlPool;
    const teamName = req.params;
    getTeamFloorScoreByName(teamName, mysqlPool)
  //  .then((teamScore) => {
      if (teamName) {
        res.status(200).json(teamName);
      } else {
        res.status(500).json({
          error: "Unable to fetch everything.  Please try again later."
        });
      }
    //})
    //.catch((err) => {

    //});
});

function getTeamFloorScoreByName(teamName, mysqlPool) {
//  return new Promise((resolve, reject) => {
    console.log("Sending all the info on everything" + teamName);
  //});
};



exports.router = router;
