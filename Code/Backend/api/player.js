const router = require('express').Router();
const validation = require('../lib/validation');

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
  floorEx: { required: true }, //bool
};
