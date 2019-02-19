const router = require('express').Router();
const validation = require('../lib/validation');

//schema for required and optional fields for a meet object

const meetSchema = {
  id: {required: true }, //medium int
  name: { required: true } //var char
};

exports.router = router;
