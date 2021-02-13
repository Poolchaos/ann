var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');
let JSEncrypt = require('node-jsencrypt');
console.log(' ::>> JSEncrypt >>>> ', JSEncrypt);

const AnonymousModel = require('../models/anonymous-model');
const RegistrationModel = require('../models/registration-model');
const UserModel = require('../models/user-model');
const sendEmail = require('../emails/email');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/ann-projector';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.post(
  '/submit',
  function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    AnonymousModel.find({}, function (err, docs) {
      if (err) console.log('err = ', err);
      if (docs[0]) {
        if (token === docs[0].anonymous) {
          return next();
        }
      }
      console.log(' ::>> anonymous tokens don`t match ');
      return res.sendStatus(401)
    });
  },
  function(req, res, next) {
    try {      
      let user = req.body;
      user._id = new ObjectID();
      let reg_token = jwt.sign({ userId: user._id }, 'completing registration');
      user.token = reg_token;

      RegistrationModel.find({ email: user.email }, function (err, docs) {
        if (docs.length === 0) {
          
          var user_instance = new RegistrationModel(user);
          user_instance.save(function (err) {
            if (err) {
              console.log(err);
              return res.sendStatus(405);
            }
            
            sendEmail(user);
            return res.send(user);
          });
        } else {
          return res.sendStatus(405);
        }
      });

    } catch(e) {
      console.log(' ::>> failed to register due to ', e);
    }
  }
);


router.post(
  '/confirm',
  function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    console.log(' ::>> req.body >>>> ', req.body);
    
    if (token == null || email == null) return res.sendStatus(401);

    RegistrationModel.find({ email }, function (err, docs) {
      if (err) console.log('err = ', err);
      let user = docs[0].toJSON();
      if (user) {
        console.log(' ::>> token1 >>>> ', token);
        console.log(' ::>> token2 >>>> ', token);
        if (token.indexOf(user.token) >= 0) {

          user.token = null;
          console.log(' ::>> sign token with data >>>> ', user);
          let reg_token = jwt.sign(user, 'complete');
          user.token = reg_token;
          user.password = password;
          
          console.log(' ::>> user signed >>>> ', user);
          var register_instance = new RegistrationModel(user);
          register_instance.deleteOne({ _id: user._id }, function (err) {
            if (err) {
              console.log(' ::>> failed to remove item ', err);
              return;
            }
            // deleted at most one tank document
                
            console.log(' ::>> remove registration ');

            var user_instance = new UserModel(user);
            user_instance.save(function (err) {
              if (err) {
                console.log(err);
                return res.sendStatus(405);
              }
              console.log(' ::>> save user ');
              return res.sendStatus(200);
            });
          });
            

        }
        return;
      }
      console.log(' ::>> tokens don`t match ');
      return res.sendStatus(401)
    });
  }
);

const pk = 'MIIEpAIBAAKCAQEAths59StFxNqXNZsi8Zm9cMTF4S4AKqDPvSGIGigwEkPmVT69' +
  'PwNFIRufgBI9QAimObnQ2WGDfI1bPxWUMqFDvykwA+qq6CH+jI6APYPzXyyWawE6' +
  'QFo/Z5o6JELuk0ioT8h51VR4oIzhFVaX9qJtaaCD64mk48Pfch57dH7VHr+xi8Ql' +
  'G0vVWSTNCG8BXC7wqv5hlydddvrZvFDaw9UVEGQwyuwiE+sJBVjx3MmjYT/OfGpp' +
  'ptSH/rhngtZPLn+6q5sJt1UkzIKExvHgyJ16tPqTsgX2zzslDuPrwQdPKa1YSvya' +
  'C3uXFcPY9gOEFyy53Jcb21/3sTig+apBugt5TwIDAQABAoIBAQCrZ9kXsRFMhstI' +
  'w6sSaTjsieoPV3MErLScOpGWvTjyGEMW/aS3SOaqkQuCSqioOvvq3cF8utI+S/cU' +
  '28TQGwZfSe9N4HXZZRXpSr/eJvLOJHO4aEFiDRAc/ge31eAldYAnCHXUnFumErRR' +
  'l14V4TDG+TTyYG55jAYnrhVZw3/qHcA7D3uCRbntRSysQ62gddZLGTPaeeizcXd1' +
  'VB4YnxOCE51xGgbcYgkmm2E8J0HiDRnmg04Jr/4RpvsBC4vM4OWUGyPVgIfIZwci' +
  'zizb/fdYPi8sP7vCsc44NLJ9P0PARJ0M1S+mChkdfLQ3nm5+7ORUeHbviY93hVjx' +
  'JyRh6idBAoGBAO2ALIS/rp/Zg6yq4mbUvmy2iMeL6TjnUzRb1z+mOLbXRsyWaex1' +
  'bJ7kihVrGOsz+TDyVQIftFBLrcFoF2jwJ7ugzraBcL7yDGYLnVv8eyuiIYuK2mh1' +
  '/aM1ICsGmQr/LwVKNBQDXDLuftW9vkFofTIGPUYMKZKrV+C+CRtnwoqRAoGBAMRK' +
  'eZxiFULEKsRpM3xkDNP/SOj4jUmmEH9Xrb3B2SyPDsTGGDeiZCFM538YRXLj9xvi' +
  'l0P3UXRspOMLMGQ2X2xGkG6IIuis+Ta4QPCwkOK05qE8/uKGxKMqzZPIjvsrJcxW' +
  'EvtU+4vt4AjnbuSvt6jVNePR6o+MVhAHLCllePXfAoGBAJPySUk0gtpOzEiudrRq' +
  'CGl+V7w+er0Y1OsD3xVmPWQgvJjLhhZnm49rfF0VRwOVb8C+5JebGl7+lbGqXxLe' +
  'r1GhPcPQ5GP+Mh0LVS4tHKk0qULc72stPSADAxPqW0HPbwITlFd3NGMB0H7jYPYr' +
  '2flki5zsDKWyGN8GYnPw8e4RAoGAdVPizvPdq3Pf8FjFepO/CzSrWv2+TghiEgvR' +
  'gPwOmNDFzh5uOUrquPDj6pcSY/MZMGTHb8uzt3h9Mmzstum9LdYb3MWowBUsPWXz' +
  'Ays23xusQzJXVAWkIbei+7PEqyMGS9YjMHGCjghYgln7cdwKVnNi69L8dmM2ygvP' +
  'fMr3e1cCgYBIEOuyDFCY4ytGktw4zKAymUGHSOakoPhY2v8JTqr1I6Y6T1Sh/Zc8' +
  '+TpOrQlbWZbos32YZ0L7CtjMVyRNjvZLaGuO/82Enb/t5gahrJaDJdF++dELW4wQ' +
  '6YovYK6ZYUj4KHcZZZp+nSTQPIMLNrR9K1HZg5pW9/IvopvFl4RdRw==';
  const k = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAths59StFxNqXNZsi8Zm9cMTF4S4AKqDPvSGIGigwEkPmVT69PwNFIRufgBI9QAimObnQ2WGDfI1bPxWUMqFDvykwA+qq6CH+jI6APYPzXyyWawE6QFo/Z5o6JELuk0ioT8h51VR4oIzhFVaX9qJtaaCD64mk48Pfch57dH7VHr+xi8QlG0vVWSTNCG8BXC7wqv5hlydddvrZvFDaw9UVEGQwyuwiE+sJBVjx3MmjYT/OfGppptSH/rhngtZPLn+6q5sJt1UkzIKExvHgyJ16tPqTsgX2zzslDuPrwQdPKa1YSvyaC3uXFcPY9gOEFyy53Jcb21/3sTig+apBugt5TwIDAQAB';

router.post(
  '/authenticate',
  function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    AnonymousModel.find({}, function (err, docs) {
      if (err) console.log('err = ', err);
      if (docs[0]) {
        if (token.indexOf(docs[0].anonymous) >= 0) {
          return next();
        }
      }
      console.log(' ::>> anonymous tokens don`t match ');
      return res.sendStatus(401)
    });
  },
  function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    console.log(' ::>> req.body >>>> ', req.body);
    
    if (token == null || email == null) return res.sendStatus(401);

    UserModel.find({ email }, function (err, docs) {
      if (err) console.log('err = ', err);
      let user = docs[0].toJSON();
      console.log(' ::>> user = ', user);
      if (user) {
        
        try {
          let decrypt = function(data) {
            var _decrypt = new JSEncrypt();
            _decrypt.setPrivateKey(pk);
            return _decrypt.decrypt(data);
          };

          if (decrypt(password) === decrypt(user.password)) {
            delete user.password;
            return res.send(user);
          }

        } catch(e) {
          console.log(' ::>> ------- ', e);
        }

        console.log(' ::>> user matches, logged in ');
      }
      return res.sendStatus(401)
    });
  }
);

module.exports = router;
