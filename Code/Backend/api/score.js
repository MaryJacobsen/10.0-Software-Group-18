const router = require('express').Router();
const validation = require('../lib/validation');

//schema for required and optional fields for a score object

const scoreSchema = {
  id: { required: true }, //medium int
  playerID: { required: true }, //medium int
  judgeID: { required: true }, //medium int
  score: { required: true }, //Decimal
  event: { required: true }, //varchar
  exhibition: { required: true }, //bit
  meetID: { required: true } //medium int
};

exports.router = router;
