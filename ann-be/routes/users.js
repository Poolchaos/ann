var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const UserModel = require('../models/user-model');
const ObjectID = require('mongodb').ObjectID;

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/db-ann';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* GET users listing. */
router.get('/', function(req, res, next) {
  try {

    UserModel.find({}, function (err, docs) {
      // docs.forEach
      console.log(' ::>> docs >>>> ', docs);
      res.send(docs);
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
      if (err) {
        console.log(err);
        return res.send('respond with a resource');
      }
      // saved!
    });

    res.send('respond with a resource');
  } catch(e) {
    console.log(' ::>> error ', e);
  }
});

module.exports = router;
