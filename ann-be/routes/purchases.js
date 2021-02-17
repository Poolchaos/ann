var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const { authenticateToken } = require('./authenticate-token');
const PurchaseModel = require('../models/purchase-model');
const ROLES = require('../enums/roles');
const logger = require('../logger');

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
    try {
      if (!req.body) return res.sendStatus(500, { error: err });

      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1];
      const decrypted = jwt.verify(token, 'complete');

      if (!decrypted) return res.sendStatus(401);

      const articleIds = req.body;
      if (!articleIds || articleIds.length === 0) return res.sendStatus(204);
      
      let purchaseCount = 0;

      //todo: send email

      articleIds.forEach(articleId => {
        
        const payload = {
          _id: new ObjectID(),
          articleId: articleId,
          userId: decrypted._id,
          date: Date.now()
        };

        var instance = new PurchaseModel(payload);
        instance.save(function (err) {
          if (err) return res.sendStatus(500, {error: err});
          // saved!
          purchaseCount ++;
          log('Article purchased', articleId, decrypted._id)

          if (purchaseCount >= articleIds.length) {
            return res.sendStatus(200);
          }
        });
      });
    } catch(e) {
      console.log(' ::>> error >>>>> ', e);
      return res.sendStatus(500, { error: err });
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

module.exports = router;
