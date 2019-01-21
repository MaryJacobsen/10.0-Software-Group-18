const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(express.static('public'));

app.listen(port, () => {
      console.log("== Server is running on port", port);
    });
