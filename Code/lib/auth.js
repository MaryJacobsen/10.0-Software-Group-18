const jwt = require('jsonwebtoken');

const secretKey = 'hunter2';

function checkAuthToken(token, authLevel) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, payload) => {
      if (!err && payload.auth >= authLevel) {
        resolve();
      } else {
        reject(403);
      }
    });
  })
}

function generateAuthToken(userID, auth) {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: userID,
      auth: auth
    };
    jwt.sign(payload, secretKey, {expiresIn: '12h'}, (err, token) => {
      if(err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

function requireAuthentication(req, res, next) {
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;
  jwt.verify(token, secretKey, (err, payload) => {
    if (!err) {
      req.user = payload.sub;
      next();
    } else {
      res.status(401).json({
        error: "Invalid authentication token"
      });
    }
  });
}

function requireAdmin(req, res, next) {
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;
  jwt.verify(token, secretKey, (err, payload) => {
    if (!err && payload.auth == 1) {
      req.user = payload.sub;
      next();
    } else {
      res.status(401).json({
        error: "Unauthorized authentication token"
      });
    }
  });
}

exports.generateAuthToken = generateAuthToken;
exports.requireAuthentication = requireAuthentication;
exports.requireAdmin = requireAdmin;
exports.checkAuthToken = checkAuthToken;
