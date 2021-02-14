var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');
let JSEncrypt = require('node-jsencrypt');
require('dotenv').config();


const AnonymousModel = require('../models/anonymous-model');
const RegistrationModel = require('../models/registration-model');
const UserModel = require('../models/user-model');
const sendEmail = require('../emails/email');

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
  function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    AnonymousModel.find({}, function (err, docs) {
      if (err) return res.send(500, {error: err});
      
      if (docs[0]) {
        if (token === docs[0].anonymous) {
          return next();
        }
      }
      console.log(' ::>> anonymous tokens don`t match ');
      return res.sendStatus(401)
    });
  },
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
  '/confirm',
  function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const password = req.body ? req.body.password : null;
    console.log(' ::>> req.body >>>> ', req.body);
    
    if (token == null) return res.sendStatus(401);

    const decrypted = jwt.verify(token, 'completing registration');;
    console.log(' ::> >decrypted >>>> ', decrypted);

    RegistrationModel.find({ _id: decrypted.userId }, function (err, docs) {
      if (err) return res.send(500, {error: err});

      let user = docs[0].toJSON();
      console.log(' ::>> user >>>> ', user);
      if (user) {

        user.token = null;
        user.token = jwt.sign(user, 'complete');
        user.password = password;
        
        RegistrationModel.findOneAndUpdate(
          { _id: user._id },
          { ...user, isComplete: true },
          { upsert: true },
          function (err) {
            if (err) return res.send(500, {error: err});
                

            var user_instance = new UserModel(user);
            user_instance.save(function (err) {
              if (err) return res.send(500, {error: err});

              return res.sendStatus(200);
            });
          });

      } else {
        return res.sendStatus(401)
      }
    });
  }
);

router.post(
  '/authenticate',
  function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    AnonymousModel.find({}, function (err, docs) {
      if (err) console.log('err = ', err);
      if (docs[0]) {
        if (token.indexOf(docs[0].anonymous) >= 0) {
          return next();
        }
      }
      console.log(' ::>> anonymous tokens don`t match ');
      return res.sendStatus(401)
    });
  },
  function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    console.log(' ::>> req.body >>>> ', req.body);
    
    if (token == null || email == null) return res.sendStatus(401);

    UserModel.find({ email }, function (err, docs) {
      if (err || docs.length == 0) {
        console.log('err = ', err);
        return res.sendStatus(401)
      }
      let user = docs[0].toJSON();
      console.log(' ::>> user = ', user);
      if (user) {
        
        try {
          if (decrypt(password) === decrypt(user.password)) {
            delete user.password;
            return res.send(user);
          }

        } catch(e) {
          console.log(' ::>> ------- ', e);
        }

        console.log(' ::>> user matches, logged in ');
      }
      return res.sendStatus(401)
    });
  }
);

module.exports = router;
