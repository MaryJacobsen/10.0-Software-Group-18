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
//router.get('/:teamName',function(req, res, next){
//  console.log("got it");
//});

function getScoreByName(teamName, mysqlPool) {
//  return new Promise((resolve, reject) => {
    console.log(teamName);
  //});
};


exports.router = router;
