var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const UserRequestModel = require('../models/user-request-model');
const RegistrationModel = require('../models/registration-model');
const ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');

const { authenticateToken } = require('./authenticate-token');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* GET users listing. */
router.get('/', authenticateToken, function(req, res, next) {
  try {
    UserRequestModel.find({}, function (err, docs) {
      return res.send(docs);
    });
  } catch(e) {
    console.log(' ::>> error ', e);
  }
});

const removeUser = function(userId) {
  UserRequestModel.deleteOne(
    { _id: userId },
    function (err) {
      if (err) return res.send(500, { error: err });
      return res.sendStatus(200);
      // removed
    }
  );
}

const updateRegistration = function(userId) {
  RegistrationModel.findOneAndUpdate(
    { _id: userId },
    { ...user, status: '' },// todo: set enum deleted
    { upsert: true },
    function (err) {
      if (err) return res.send(500, {error: err});
          

      var user_instance = new UserRequestModel(user);
      user_instance.save(function (err) {
        if (err) return res.send(500, {error: err});

        return res.sendStatus(200);
      });
    }
  );
}

router.delete('/', authenticateToken, function(req, res, next) {
  try {
    console.log(' ::>> req >>> ', req.body);

    if (!req.body || !req.body.userId) {
      return res.sendStatus(500, { error: err });
    }
    removeUser(req.body.userId);
    updateRegistration(req.body.userId)

    return res.sendStatus(500);
  } catch(e) {
    console.log(' ::>> error ', e);
  }
});

router.post('/', function(req, res, next) {
  try {
    var myobj = {
      _id: new ObjectID(),
      firstName: "phillip-juan",
      surname: "van der Berg",
      email: "bt1phillip@gmail.com",
      contactNumbers: ["0712569431"]
    };

    var user_instance = new UserRequestModel(myobj);
    // Save the new model instance, passing a callback
    user_instance.save(function (err) {
      if (err) return res.send(500, {error: err});
      return res.sendStatus(200);
      // saved!
    });

  } catch(e) {
    console.log(' ::>> error ', e);
  }
});

module.exports = router;
