var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');
let JSEncrypt = require('node-jsencrypt');
require('dotenv').config();

const RegistrationModel = require('../models/registration-model');
const UserModel = require('../models/user-model');
const sendEmail = require('../emails/email');
const {
  authenticateToken,
  authenticateAnonymous,
  tokenValidate
} = require('./authenticate-token');
const logger = require('../logger');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const decrypt = function(data) {
  var _decrypt = new JSEncrypt();
  _decrypt.setPrivateKey(process.env.PRIVATE_KEY);
  return _decrypt.decrypt(data);
};

router.post(
  '/submit',
  authenticateAnonymous,
  function(req, res, next) {

    // todo: security against multiple simultaneous requests
    // todo: ip checks
    // block source requests by ip
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const decrypted = jwt.verify(token, 'anonymous');

    console.log(' ::>> decrypted >>>> ', decrypted);

    try {
      let user = req.body;
      user._id = new ObjectID();
      let reg_token = jwt.sign({ userId: user._id }, 'completing registration');
      user.token = reg_token;

      RegistrationModel.find({ email: user.email }, function (err, docs) {
        if (docs.length === 0) {
          
          var user_instance = new RegistrationModel(user);
          user_instance.save(function (err) {
            if (err) return res.sendStatus(500, {error: err});
            log('Submit registration', user.email, user._id, decrypted.anonymous);
            sendEmail(user);
            return res.send(user);
          });
        } else if (docs[0].status === 'removed') {
          return res.sendStatus(500, { error: 'A user with this email has been removed from the system' });
        } else {
          return res.sendStatus(401);
        }
      });

    } catch(e) {
      console.log(' ::>> failed to register due to ', e);
    }
  }
);

router.post(
  '/complete-registration',
  tokenValidate,
  function (req, res, next) {
    try {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1];
      const decrypted = jwt.verify(token, 'completing registration');

      if (!req.body.password) return res.sendStatus(500, {error: 'No password specified'});
    
      // find user entity for new token
      RegistrationModel.find({ _id: decrypted.userId }, function (err, docs) {
        if (err) return res.sendStatus(500, {error: err});
    
        let user = docs[0].toJSON();
        if (user) {
          const password = req.body ? req.body.password : null;
          user.token = null;
          user.token = jwt.sign(user, 'complete');
          user.password = password;
          
          RegistrationModel.findOneAndUpdate(
            { _id: user._id },
            { status: 'registration-complete' },
            { upsert: true },
            function (err) {
              if (err) return res.sendStatus(500, {error: err});

              const user_instance = new UserModel(user);
              user_instance.save(function (err) {
                if (err) return res.sendStatus(500, {error: err});
                log('Registration Complete', user.email);
                return res.sendStatus(200);
              });
            }
          );
        } else {
          return res.sendStatus(401)
        }
      });
    } catch(e) {console.log(' ::>> error >>>> ', e);
      res.sendStatus(500, {error: e});
    }
  }
);

router.post(
  '/authenticate',
  authenticateAnonymous,
  function (req, res, next) {
    try {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1];
      const email = req.body ? req.body.email : null;
      const password = req.body ? req.body.password : null;
      
      if (!token || email == null) return res.sendStatus(401);

      UserModel
        .find({ email })
        .select({ token: 1, role: 1, password: 1 })
        .then(function (docs, err) {
          if (err || !docs || docs.length == 0) return res.sendStatus(401, {error: err});

          let user = docs[0].toJSON();
          if (user && decrypt(password) === decrypt(user.password)) {
            delete user.password;
            log('User authenticated', email);
            return res.send(user);
          }
          return res.sendStatus(401)
        })
        .catch(e => {
          console.log(' ::>> error 2 ', e);
          return res.sendStatus(500, {error: e})
        });

    } catch(e) {
      console.log(' ::>> error 1 ', e);
      return res.sendStatus(500, {error: e})
    }
  }
);

router.post('/authenticate-token',
  (req, res, next) => authenticateToken(req, res, next),
  function(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    const decrypted = jwt.verify(token, 'complete');
    try {
      UserModel.find({}, function (err, docs) {
        if (err || docs.length == 0) return res.sendStatus(500, {error: err});
        log('User authenticated via token', decrypted.email);
        return res.sendStatus(200);
      });
    } catch(e) {
      return res.sendStatus(500, {error: e})
    }
  }
);

const log = function(message, email, userId, decrypted) {
  logger.info(message, {
    email,
    userId,
    decrypted,
    domain: 'passport'
  });
}

module.exports = router;
