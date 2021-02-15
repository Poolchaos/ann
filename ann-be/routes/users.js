var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const UserRequestModel = require('../models/user-request-model');
const RegistrationModel = require('../models/registration-model');
const ObjectID = require('mongodb').ObjectID;

const { authenticateToken } = require('./authenticate-token');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const removeUser = function(req, res) {
  const user = req.body;
  UserRequestModel.deleteOne(
    { _id: user.userId },
    function (err) {
      if (err) return res.send(500, { error: err });
      return updateRegistration(res, user)
    }
  );
}

const updateRegistration = function(res, user) {
  RegistrationModel.findOneAndUpdate(
    { _id: user.userId },
    { status: 'removed' },// todo: set enum deleted
    { upsert: true },
    function (err) {
      if (err) return res.send(500, {error: err});
      return res.sendStatus(200);
    }
  );
}

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

router.delete('/', authenticateToken, function(req, res, next) {
  try {
    console.log(' ::>> req >>> ', req.body);

    if (!req.body || !req.body.userId) {
      return res.sendStatus(500, { error: err });
    }
    return removeUser(req, res);
  } catch(e) {
    console.log(' ::>> error ', e);
  }
});

module.exports = router;
