const router = require('express').Router();
const validation = require('../lib/validation');

//schema for required and optional fields for a team object

const lineupSchema = {
  player: { required: true }, //varchar
  order: { required: true }, //int
  team: { required: true }, //varchar
  event: { required: true }, //varchar
};
