const jwt = require('jsonwebtoken');

const ROLES = require('../enums/roles');
const UserRequestModel = require('../models/user-request-model');

const authenticateUser = function(res, next, userId) {
  UserRequestModel.find({ _id: userId }, function (err, docs) {
    const user = docs[0];
    if (user) {
      const decryptedUser = jwt.verify(user.token, 'complete');
      if (decryptedUser && decryptedUser.role === ROLES.ADMIN) {
        return next();
      }
    }
    return res.sendStatus(401, { error: 'Unauthorized User' });
  });
};

const authenticateToken = function(req, res, next) {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    const decrypted = jwt.verify(token, 'complete');
    if (decrypted && decrypted.role === ROLES.ADMIN) {
      return authenticateUser(res, next, decrypted._id);
    }
  } catch(e) {
    console.log(' ::>> authenticateToken error ', e);
    return res.sendStatus(500, { error: e });
  }
}

module.exports = { authenticateToken };