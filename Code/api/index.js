const router = module.exports = require('express').Router();

router.use('/meet', require('./meet').router);
router.use('/team', require('./team').router);
router.use('/player', require('./player').router);
router.use('/judge', require('./judge').router);
router.use('/lineup', require('./lineup').router);
router.use('/score', require('./score').router);
router.use('/user', require('./user').router);
router.use('/', require('./pages').router);
