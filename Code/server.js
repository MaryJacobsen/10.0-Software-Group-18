const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const api = require('./api');
const path = require('path')
const sessions = require("client-sessions");

const app = express();
const port = process.env.PORT || 8000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded( {extended: true }));
app.use(express.static('public'));
app.use(sessions({
  cookieName: 'meetSession', //key name added to request onject
  secret: "process.env.SESSIONS",
  duration: 12 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 60
}));

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

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', api);

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});

app.use(function(req, res, next) {
  if (req.mySession.seenyou) {
    res.setHeader('X-Seen-You', 'true');
  } else {
    // setting a property will automatically cause a Set-Cookie response
    // to be sent
    req.mySession.seenyou = true;
    res.setHeader('X-Seen-You', 'false');
  }
});
