var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const { authenticateToken } = require('./authenticate-token');
const ArticleModel = require('../models/article-model');
const ROLES = require('../enums/roles');
const CATEGORIES = require('../enums/categories');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.get('/',
  (req, res, next) => authenticateToken(req, res, next, [ROLES.JOURNALIST]),
  function(req, res, next) {
    try {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1];
      const decrypted = jwt.verify(token, 'complete');

      if (!decrypted) return res.sendStatus(401);

      ArticleModel.find({ userId: decrypted._id }, function (err, docs) {
        return res.send(docs);
      });
    } catch(e) {
      console.log(' ::>> error ', e);
    }
  }
);

router.get('/review',
  (req, res, next) => authenticateToken(req, res, next, [ROLES.ADMIN]),
  function(req, res, next) {
    try {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1];
      const decrypted = jwt.verify(token, 'complete');

      if (!decrypted) return res.sendStatus(401);

      ArticleModel.find({ contentConfirmed: false }, function (err, docs) {
        return res.send(docs);
      });
    } catch(e) {
      console.log(' ::>> error ', e);
    }
  }
);

router.get('/category',
  (req, res, next) => authenticateToken(req, res, next, [ROLES.ADMIN, ROLES.JOURNALIST, ROLES.DEFAULT_USER]),
  function(req, res, next) {
    try {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1];
      const decrypted = jwt.verify(token, 'complete');

      if (!decrypted) return res.sendStatus(401);
      if (!req.query.category) return res.sendStatus(500, 'No category specified');
      if (!CATEGORIES.includes(req.query.category)) return res.sendStatus(500);

      const params = {
        ...req.query,
        contentConfirmed: true
      };
      ArticleModel.find(params, function (err, docs) {
        return res.send(docs);
      });
    } catch(e) {
      console.log(' ::>> error ', e);
    }
  }
);

router.post('/', 
  (req, res, next) => authenticateToken(req, res, next, [ROLES.JOURNALIST]),
  function(req, res, next) {
    try {
      if (!req.body) return res.sendStatus(500, { error: err });

      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1];
      const decrypted = jwt.verify(token, 'complete');

      if (!decrypted) return res.sendStatus(401);
      // todo: add creator and date

      let article = req.body;
      article._id = new ObjectID();
      article.userId = new ObjectID(decrypted._id);
      article.contentConfirmed = false;

      var instance = new ArticleModel(article);
      instance.save(function (err) {
        if (err) return res.sendStatus(500, {error: err});
        return res.send({ articleId: article._id });
        // saved!
      });

    } catch(e) {
      console.log(' ::>> error >>>>> ', e);
      return res.sendStatus(500, { error: err });
    }
  }
);

router.post('/review', 
  (req, res, next) => authenticateToken(req, res, next, [ROLES.ADMIN]),
  function(req, res, next) {
    try {
      if (!req.body) return res.sendStatus(500, { error: err });
      const article = req.body;

      return ArticleModel.findOneAndUpdate(
        { _id: article.articleId },
        { contentConfirmed: true },
        { upsert: true },
        function (err) {
          if (err) return res.sendStatus(500, {error: err});
          res.sendStatus(200);
        }
      );

    } catch(e) {
      console.log(' ::>> error >>>>> ', e);
      return res.sendStatus(500, { error: err });
    }
  }
);

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
