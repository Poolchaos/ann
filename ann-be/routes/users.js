var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const UserModel = require('../models/user-model');
const ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
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
        return res.sendStatus(405);
      }
      return res.sendStatus(200);
      // saved!
    });

  } catch(e) {
    console.log(' ::>> error ', e);
  }
});

// var testtoken = jwt.sign({ anonymous: 'is-anonymous' }, 'anonymous');
// console.log(' ::>> testtoken >>>> ', testtoken);
// jwt.verify(token, pubKey)

// router.post(
//   '/user-registration/submit',
//   function (req, res, next) {
//     // Gather the jwt access token from the request header
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1];
    
//     if (token == null) return res.sendStatus(401) // if there isn't any token

//     AnonymousModel.find({}, function (err, docs) {
//       console.log(' ::>> docs >>>> ', docs[0], docs);
  
//       if (docs[0]) {
//         if (token === docs[0].anonymous) {
//           next();
//         }
//       } else {
//         console.log(' ::>> anonymous tokens don`t match ');
//         return res.sendStatus(401)
//       }

//       // jwt.verify(token, 'anonymous', (err, data) => {
//       //   console.log(' ::>> anonymous ', err, data)
//       //   if (err) return res.sendStatus(403)

//       // })
//     });
//   },
//   function(req, res, next){
//     try {
//       let user = req.body;
//       user._id = new ObjectID();
      
//       var user_instance = new RegistrationModel(user);
//       // Save the new model instance, passing a callback
//       user_instance.save(function (err) {
//         if (err) {
//           console.log(err);
//           return res.sendStatus(405);
//         }
//         return res.sendStatus(200);
//         // saved!
//       });

//     } catch(e) {

//     }
//   });

module.exports = router;
