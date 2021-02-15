var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const { authenticateToken } = require('./authenticate-token');
const ArticleModel = require('../models/article-model');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.post('/', authenticateToken, function(req, res, next) {
  try {
    if (!req.body) {
      return res.sendStatus(500, { error: err });
    }
    let article = req.body;
    article._id = new ObjectID();

    console.log(' ::>> article >>>>> ', article);

    var instance = new ArticleModel(article);
    // todo: upload files
    instance.save(function (err) {
      if (err) return res.send(500, {error: err});
      return res.sendStatus(200);
      // saved!
    });

  } catch(e) {
    return res.sendStatus(500, { error: err });
  }
});

router.get('/', authenticateToken, function(req, res, next) {
  try {
    ArticleModel.find({}, function (err, docs) {
      return res.send(docs);
    });
  } catch(e) {
    console.log(' ::>> error ', e);
  }
});

// router.delete('/', authenticateToken, function(req, res, next) {
//   try {
//     console.log(' ::>> req >>> ', req.body);

//     if (!req.body || !req.body.userId) {
//       return res.sendStatus(500, { error: err });
//     }
//     return removeUser(req, res);
//   } catch(e) {
//     console.log(' ::>> error ', e);
//   }
// });

module.exports = router;
