var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const UserModel = require('../models/user-model');
const RegistrationModel = require('../models/registration-model');
const ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');

const ROLES = require('../enums/roles');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* GET users listing. */
router.get('/', function(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  try {
    const decrypted = jwt.verify(token, 'complete');
    if (decrypted) {
      if (decrypted.role === ROLES.ADMIN) {
        return next();
      }
      return res.sendStatus(401);
    }
  } catch(e) {
    console.log(' decrypt error >>>>> ', e);
    return res.sendStatus(500);
  }
}, function(req, res, next) {
  try {
    RegistrationModel.find({}, function (err, docs) {
      return res.send(docs);
    });
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

    var user_instance = new UserModel(myobj);
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
