const router = require('express').Router();
var path = require('path')

router.get('/vaultscoring', function (req, res, next){
  res.sendFile(path.join(__dirname + '../pages/vaultscoring.html'));
});

exports.router = router;
