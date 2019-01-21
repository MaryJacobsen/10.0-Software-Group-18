const router = require('express').Router();
const validation = require('../lib/validation');

//schema for required and optional fields for a team object

const teamSchema = {
  teamScore: { required: true }, //int
  floorName: { required: true }, //varchar
  vaultScore: { required: true }, //int
  barsScore: { required: true }, //int
  beamScore: { required: true }, //int
  floorScore: { required: true }, //int
};
