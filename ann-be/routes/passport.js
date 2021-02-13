var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');

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
      let reg_token = jwt.sign({ userId: user._id }, 'completing registration');
      user.token = reg_token;

      RegistrationModel.find({ email: user.email }, function (err, docs) {
        if (docs.length === 0) {
          
          var user_instance = new RegistrationModel(user);
          user_instance.save(function (err) {
            if (err) {
              console.log(err);
              return res.sendStatus(405);
            }
            
            sendEmail(user);
            return res.send(user);
          });
        } else {
          return res.sendStatus(405);
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
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    console.log(' ::>> req.body >>>> ', req.body);
    
    if (token == null || email == null) return res.sendStatus(401);

    RegistrationModel.find({ email }, function (err, docs) {
      if (err) console.log('err = ', err);
      let user = docs[0];
      if (user) {
        console.log(' ::>> token1 >>>> ', token);
        console.log(' ::>> token2 >>>> ', token);
        if (token.indexOf(user.token) >= 0) {

          user.token = null;
          console.log(' ::>> sign token with data >>>> ', user);
          let reg_token = jwt.sign(user.toJSON(), 'complete');
          user.token = reg_token;
          
          console.log(' ::>> user signed >>>> ', user);
          var register_instance = new RegistrationModel(user);
          register_instance.deleteOne({ _id: user._id }, function (err) {
            if (err) {
              console.log(' ::>> failed to remove item ', err);
              return;
            }
            // deleted at most one tank document
                
            console.log(' ::>> remove registration ');

            var user_instance = new UserModel(user.toJSON());
            user_instance.save(function (err) {
              if (err) {
                console.log(err);
                return res.sendStatus(405);
              }
              console.log(' ::>> save user ');
              return res.sendStatus(200);
            });
          });
            

        }
        return;
      }
      console.log(' ::>> tokens don`t match ');
      return res.sendStatus(401)
    });
  }
);

module.exports = router;
