const router = require('express').Router();
var path = require('path')

router.get('/vaultscoring', function (req, res, next){
  res.sendFile(path.join(__dirname + 'vaultscoring copy.html'));
});

exports.router = router;
