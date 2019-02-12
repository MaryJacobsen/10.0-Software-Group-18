const router = module.exports = require('express').Router();

router.use('/team', require('./team').router);
router.use('/player', require('./player').router);
router.use('/lineup', require('./lineup').router);
router.use('/pages', require('./pages').router);
