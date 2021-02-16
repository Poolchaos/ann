var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');
var btoa = require('btoa');

const { authenticateToken } = require('./authenticate-token');

const ArticleModel = require('../models/article-model');
const FileModel = require('../models/file-model');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.post('/', authenticateToken, function(req, res, next) {
  try {
    if (!req.body) return res.sendStatus(500, { error: err });

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const decrypted = jwt.verify(token, 'complete');

    const extention = req.body.name.split('.');
    const generatedName = new ObjectID();
    const audio = {
      _id: new ObjectID(),
      name: req.body.name,
      location: __dirname + `\\tmp\\${generatedName}.${extention[extention.length - 1]}`,
      type: req.body.type,
      articleId: req.body.articleId
    };
    // article._id = new ObjectID();
    // article.userId = new ObjectID(decrypted._id);
    // article.contentConfirmed = false;

    console.log(' ::>> article >>>>> ', audio);
    
    // todo: base64 
    // todo: check against format enums [mp3 and wav]
  
    fs.writeFileSync(audio.location, Buffer.from(req.body.data.replace(`data:${audio.type};base64,`, ''), 'base64'));

    var instance = new FileModel(audio);
    instance.save(function (err) {
      if (err) return res.send(500, {error: err});

      return ArticleModel.findOneAndUpdate(
        { _id: audio.articleId },
        { $push: { files: audio._id } },
        { upsert: true },
        function (err) {
          if (err) return res.send(500, {error: err});
          res.sendStatus(200);
        }
      );
    });

  } catch(e) {
    console.log(' ::>> error >>>>> ', e);
    return res.sendStatus(500, { error: err });
  }
});

// function b64EncodeUnicode(str) {
//   // first we use encodeURIComponent to get percent-encoded UTF-8,
//   // then we convert the percent encodings into raw bytes which
//   // can be fed into btoa.
//   return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
//       function toSolidBytes(match, p1) {
//           return String.fromCharCode('0x' + p1);
//   }));
// }

router.put('/', authenticateToken, function(req, res, next) {
  try {
    if (!req.body) return res.sendStatus(500, { error: err });

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const decrypted = jwt.verify(token, 'complete');
    
    if (!decrypted) return res.sendStatus(401);

    console.log(' ::>> req.body >>>>> ', req.body);

    FileModel.find({ _id: req.body.audioId }, function (err, docs) {
      if (docs && docs.length > 0) {

        const doc = docs[0];
        
        fs.readFile(doc.location, (error, data) => {
          if (error) return res.sendStatus(500, { error });
          return res.send({
            type: doc.type,
            content: Buffer.from(data, 'binary').toString('base64'),
            data: data
          });
        });
      } else {
        return res.sendStatus(500, { error: 'File does not exist' });
      }
    });
  } catch(e) {
    console.log(' ::>> error >>>>> ', e);
    return res.sendStatus(500, { error: err });
  }
});

module.exports = router;
