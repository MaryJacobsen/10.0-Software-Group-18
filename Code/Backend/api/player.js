const router = require('express').Router();
//const validation = require('../lib/validation');

const playerSchema = {
  playerNum: { required: true }, //int
  team: { required: true }, //varchar
  vaultScore: { required: true }, //int
  barScore: { required: true }, //int
  beamScore: { required: true }, //int
  floorScore: { required: true }, //int
  AAScore: { required: true }, //int
  vaultEx: { required: true }, //bool
  barsEx: { required: true }, //bool
  beamEx: { required: true }, //bool
  floorEx: { required: true } //bool
};

router.get('/:playerNum', function (req, res, next) {
    //console.log(" -- req.params:", req.params.teamName);
    const mysqlPool = req.app.locals.mysqlPool;
    const playerNum = req.params.playerNum;
    getScoreByName(playerNum, mysqlPool)
    //.then((playerNum) => {
      if (playerNum) {
        res.status(200).json(playerNum);
      } else {
        res.status(500).json({
          error: "Unable to fetch playerNum.  Please try again later."
        });
      }
    //})
    //.catch((err) => {

    //});
});

function getScoreByName(playerNum, mysqlPool) {
  //return new Promise((resolve, reject) => {
    console.log(playerNum);
  //});
};

exports.router = router;
