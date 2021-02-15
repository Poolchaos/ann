var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');
let JSEncrypt = require('node-jsencrypt');
require('dotenv').config();


const RegistrationModel = require('../models/registration-model');
const UserRequestModel = require('../models/user-request-model');
const UserResponseModel = require('../models/user-response-model');
const sendEmail = require('../emails/email');
const {
  authenticateToken,
  authenticateAnonymous,
  tokenValidate
} = require('./authenticate-token');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

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
    try {      
      let user = req.body;
      user._id = new ObjectID();
      let reg_token = jwt.sign({ userId: user._id }, 'completing registration');
      user.token = reg_token;

      RegistrationModel.find({ email: user.email }, function (err, docs) {
        if (docs.length === 0) {
          
          var user_instance = new RegistrationModel(user);
          user_instance.save(function (err) {
            if (err) return res.send(500, {error: err});
            
            sendEmail(user);
            return res.send(user);
          });
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

      if (!req.body.password) return res.send(500, {error: 'No password specified'});
    
      // find user entity for new token
      RegistrationModel.find({ _id: decrypted.userId }, function (err, docs) {
        if (err) return res.send(500, {error: err});
    
        let user = docs[0].toJSON();
        if (user) {
          const password = req.body ? req.body.password : null;
          user.token = null;
          user.token = jwt.sign(user, 'complete');
          user.password = password;
          
          RegistrationModel.findOneAndUpdate(
            { _id: user._id },
            { ...user, status: 'registration-complete' },
            { upsert: true },
            function (err) {
              if (err) return res.send(500, {error: err});

              const user_instance = new UserRequestModel(user);
              user_instance.save(function (err) {
                if (err) return res.send(500, {error: err});
                return res.sendStatus(200);
              });
            }
          );
        } else {
          return res.sendStatus(401)
        }
      });
    } catch(e) {console.log(' ::>> error >>>> ', e);
      res.send(500, {error: e});
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
      
      if (token == null || email == null) return res.sendStatus(401);

      UserResponseModel.find({ email }, function (err, docs) {
        if (err || docs.length == 0) return res.sendStatus(401, {error: err});

        let user = docs[0].toJSON();
        if (user && decrypt(password) === decrypt(user.password)) {
          delete user.password;
          return res.send(user);
        }
        return res.sendStatus(401)
      });

    } catch(e) {
      return res.sendStatus(500, {error: e})
    }
  }
);

router.post('/authenticate-token',
  authenticateToken,
  function(req, res, next) {
    try {
      UserRequestModel.find({}, function (err, docs) {
        if (err || docs.length == 0) return res.sendStatus(500, {error: err});
        return res.sendStatus(200);
      });
    } catch(e) {
      return res.sendStatus(500, {error: e})
    }
  }
);

module.exports = router;
