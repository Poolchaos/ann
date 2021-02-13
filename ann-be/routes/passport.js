var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const AnonymousModel = require('../models/anonymous-model');
const RegistrationModel = require('../models/registration-model');
const ObjectID = require('mongodb').ObjectID;

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.post(
  '/submit',
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
  function(req, res, next) {
    try {
      let user = req.body;
      user._id = new ObjectID();

      RegistrationModel.find({ email: user.email }, function (err, docs) {
        if (docs.length === 0) {
          // todo: send email on confirmation
          
          var user_instance = new RegistrationModel(user);
          user_instance.save(function (err) {
            if (err) {
              console.log(err);
              return res.sendStatus(405);
            }
            return res.send(user);
          });
        } else {
          return res.sendStatus(405);
        }
      });

    } catch(e) {
      console.log(' ::>> failer to register ');
    }
  });

module.exports = router;
