var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const { authenticateToken } = require('./authenticate-token');
const ArticleModel = require('../models/article-model');
const ROLES = require('../enums/roles');
const CATEGORIES = require('../enums/categories');
const logger = require('../logger');

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

      ArticleModel.find({ 'created.userId': decrypted._id }, function (err, docs) {
        return res.send(docs);
      });
    } catch(e) {
      console.log(' ::>> error ', e);
      return res.sendStatus(500);
    }
  }
);

router.get('/:id',
  (req, res, next) => authenticateToken(req, res, next, [ROLES.JOURNALIST]),
  function(req, res, next) {
    try {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1];
      const decrypted = jwt.verify(token, 'complete');

      if (!decrypted) return res.sendStatus(401);
      if (!req.params || !req.params.id) return res.sendStatus(500);

      const params = {
        _id: req.params.id,
        'created.userId': decrypted._id
      };

      ArticleModel.find(params, function (err, docs) {
        if (!docs || docs.length === 0) {
          return res.sendStatus(404);
        }

        return res.send(docs[0]);
      });
    } catch(e) {
      console.log(' ::>> error ', e);
      return res.sendStatus(500);
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
      return res.sendStatus(500);
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
        category: req.query.category,
        contentConfirmed: true
      };
      ArticleModel.find(params, function (err, docs) {
        return res.send(docs);
      });
    } catch(e) {
      console.log(' ::>> error ', e);
      return res.sendStatus(500);
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
      const article = {
        _id: new ObjectID(),
        name: req.body.name,
        category: req.body.category,
        content: req.body.content,
        created: {
          userId: decrypted._id,
          timestamp: Date.now()
        },
        contentConfirmed: false
      };
      // todo: manage all new Objectid mappings

      var instance = new ArticleModel(article);
      instance.save(function (err) {
        // handle errors passed through to FE
        if (err) {
          console.log(' ::>> error ', err);
          return res.sendStatus(500, {error: err});
        }
        log('Article created', article._id, article.userId);
        return res.send({ articleId: article._id });
      });

    } catch(e) {
      error('Failed to create article', token, req.body, e);
      return res.sendStatus(500, { error: err });
    }
  }
);

router.put('/', 
  (req, res, next) => authenticateToken(req, res, next, [ROLES.JOURNALIST]),
  function(req, res, next) {
    try {
      if (!req.body) return res.sendStatus(500, { error: err });

      // todo: don't map req.body directly ever

      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1];
      const decrypted = jwt.verify(token, 'complete');

      if (!decrypted) return res.sendStatus(401);

      // todo: clean up requests by id
      // todo: change findOneAndUpdate to findy doc.save

      ArticleModel.findById(req.body.articleId, function (err, doc) {
        if (err) return res.sendStatus(500, {error: err});

        doc.name = req.body.name;
        doc.category = req.body.category;
        doc.content = req.body.content;
        doc.updated.addToSet({
          userId: decrypted._id,
          timestamp: Date.now()
        });
        doc.save();

        log('Article created', req.body.articleId, decrypted._id);
        return res.send({ articleId: req.body.articleId });
      });

    } catch(e) {
      error('Failed to create article', token, req.body, e);
      return res.sendStatus(500, { error: err });
    }
  }
);

router.post('/review', 
  (req, res, next) => authenticateToken(req, res, next, [ROLES.ADMIN]),
  function(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    try {
      const decrypted = jwt.verify(token, 'complete');

      if (!decrypted) return res.sendStatus(401);
      if (!req.body) return res.sendStatus(500, { error: err });
      const article = req.body;
      // todo: add reviewed by

      return ArticleModel.findOneAndUpdate(
        { _id: article.articleId },
        { contentConfirmed: true },
        { upsert: true },
        function (err) {
          if (err) return res.sendStatus(500, {error: err});
          log('Article reviewed', article._id, decrypted._id);
          return res.sendStatus(200);
        }
      );

    } catch(e) {
      error('Failed to review article', token, req.body, e);
      return res.sendStatus(500, { error: err });
    }
  }
);

router.delete('/',
  (req, res, next) => authenticateToken(req, res, next, [ROLES.JOURNALIST]),
  function(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    try {
      const decrypted = jwt.verify(token, 'complete');

      if (!decrypted || !req.body.articleId) return res.sendStatus(401);

      ArticleModel.deleteOne(
        { _id: req.body.articleId },
        function (err) {
          if (err) return res.sendStatus(500, { error: err });
          log('Article removed', req.body.articleId, decrypted._id);
          return res.sendStatus(200);
        }
      );
    } catch(e) {
      error('Failed to delete article', token, req.body, e);
      return res.sendStatus(500);
    }
  }
);

const log = function(message, articleId, userId) {
  logger.info(message, {
    articleId,
    userId,
    domain: 'articles'
  });
}

const error = function(message, token, body, error) {
  logger.error(message, {
    token,
    body,
    error: Object.getOwnPropertyDescriptors(new Error(error)).message,
    domain: 'articles'
  });
}

module.exports = router;
