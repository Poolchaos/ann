const mongoose = require('mongoose');
const UserSchema = require('../schemas/user-schema');

// Compile model from schema
var UserModel = mongoose.model('UserModel', UserSchema );

module.exports = UserModel;