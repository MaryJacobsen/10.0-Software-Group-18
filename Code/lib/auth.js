const jwt = require('jsonwebtoken');

const secretKey = 'hunter2';

function generateAuthToken(userID) {
  return new Promise((resolve, reject) => {
    const payload = { sub: userID };
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

exports.generateAuthToken = generateAuthToken;
exports.requireAuthentication = requireAuthentication;
