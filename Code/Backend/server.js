const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const api = require('./api');
const path = require('path')

const app = express();
const port = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded( extended: False));
app.use(express.static('public'));

app.listen(port, () => {
      console.log("== Server is running on port", port);
});

const mysqlHost = process.env.MYSQL_HOST;
const mysqlPort = process.env.MYSQL_PORT || '3306';
const mysqlDBName = process.env.MYSQL_DATABASE;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;

const maxMySQLConnections = 10;
app.locals.mysqlPool = mysql.createPool({
  connectionLimit: maxMySQLConnections,
  host: mysqlHost,
  port: mysqlPort,
  database: mysqlDBName,
  user: mysqlUser,
  password: mysqlPassword
});

app.use('/', api);


app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});