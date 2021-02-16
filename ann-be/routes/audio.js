var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

const { authenticateToken } = require('./authenticate-token');

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


    let file = req.body;
    // article._id = new ObjectID();
    // article.userId = new ObjectID(decrypted._id);
    // article.contentConfirmed = false;


    console.log(' ::>> article >>>>> ', {
      name: file.name, // change to _id
      type: file.type,
      size: file.size
    });
    
    // todo: create a file index
    // file name/path
    // userId
    // _id
    // type
  
    fs.writeFileSync(__dirname + `\\tmp\\${file.name}`, Buffer.from(file.data.replace(`data:${file.type};base64,`, ''), 'base64'));

    res.sendStatus(200);

  } catch(e) {
    console.log(' ::>> error >>>>> ', e);
    return res.sendStatus(500, { error: err });
  }
});

module.exports = router;
