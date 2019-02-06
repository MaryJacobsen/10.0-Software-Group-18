const router = module.exports = require('express').Router();

router.use('/team', require('./team').router);
router.use('/player', require('./player').router);
router.use('/player', require('./lineup').router);
