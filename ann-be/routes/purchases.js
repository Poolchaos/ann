var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const { authenticateToken } = require('./authenticate-token');
const PurchaseModel = require('../models/purchase-model');
const ArticleModel = require('../models/article-model');
const ROLES = require('../enums/roles');
const logger = require('../logger');
const { sendPurchasedEmail } = require('../emails/email');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.post('/checkout', 
  (req, res, next) => authenticateToken(req, res, next, [ROLES.DEFAULT_USER]),
  function(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    try {
      if (!req.body) return res.sendStatus(500, { error: err });
      const decrypted = jwt.verify(token, 'complete');
      if (!decrypted) return res.sendStatus(401);

      const articleIds = req.body;
      if (!articleIds || !Array.isArray(req.body) || articleIds.length === 0) return res.sendStatus(204);
      
      let purchaseCount = 0;
      let articles = [];

      console.log(' ::>> articleIds >>>> ', articleIds);

      articleIds.forEach(articleId => {
        if (!articleId) return res.sendStatus(500);
        
        const payload = {
          _id: new ObjectID(),
          articleId: articleId,
          userId: decrypted._id,
          date: Date.now()
        };

        // todo: change into a waterfall
        ArticleModel.findById(articleId, function (err, doc) {
          if (!doc) {
            console.log(' ::>> doc not found ', articleId, err, doc);
            // return res.sendStatus(404);
            return;
          }
          articles.push(doc);
            
          var instance = new PurchaseModel(payload);
          instance.save(function (err) {
            if (err) return res.sendStatus(500, {error: err});
            // saved!
            log('Article purchased', articleId, decrypted._id);
            console.log(' ::>> purchase aricle ', articleId);
            purchaseCount ++;

            if (purchaseCount >= articleIds.length) {
              sendPurchasedEmail(decrypted, articles);
              return res.sendStatus(200);
            }
          });
        });
      });
    } catch(e) {
      error('Failed to checkout cart', token, req.body, e);
      return res.sendStatus(500, { error: err });
    }
  }
);

router.get('/all',
  (req, res, next) => authenticateToken(req, res, next, [ROLES.ADMIN]),
  function(req, res, next) {
    try {
      PurchaseModel.find({}, function (err, docs) {
        let count = 0;
        let list = [];

        docs.forEach(item => {
          ArticleModel.findById(item.articleId, function (err, doc) {
            if (err) return;
            list.push(doc);
            count++;
            if (count >= docs.length) {
              return res.send(list);
            }
          });
        });
      });
    } catch(e) {
      console.log(' ::>> error ', e);
    }
  }
);

router.get('/',
  (req, res, next) => authenticateToken(req, res, next, [ROLES.ADMIN, ROLES.DEFAULT_USER]),
  function(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    try {
      const decrypted = jwt.verify(token, 'complete');
      if (!decrypted) return res.sendStatus(401);

      PurchaseModel.find({ userId: decrypted._id }, function (err, docs) {
        let count = 0;
        let list = [];

        docs.forEach(item => {
          ArticleModel.findById(item.articleId, function (err, doc) {
            if (err) return;
            list.push(doc);
            count++;
            if (count >= docs.length) {
              return res.send(list);
            }
          });
        });
      });
    } catch(e) {
      console.log(' ::>> error ', e);
    }
  }
);

const log = function(message, articleId, userId) {
  logger.info(message, {
    articleId,
    userId,
    domain: 'purchases'
  });
}

const error = function(message, token, body, error) {
  logger.error(message, {
    token,
    body,
    error: Object.getOwnPropertyDescriptors(new Error(error)).message,
    domain: 'purchases'
  });
}

module.exports = router;
