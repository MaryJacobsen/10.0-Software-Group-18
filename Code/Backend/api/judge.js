const router = require('express').Router();
const validation = require('../lib/validation');

//schema for required and optional fields for a judge object

const judgeSchema = {
  id: {required: true }, //medium int
  name: { required: true }, //var char
  meetID: { required: true } //medium int
};

exports.router = router;
