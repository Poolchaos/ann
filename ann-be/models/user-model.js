const mongoose = require('mongoose');

const UserSchema = require('../schemas/user-schema');

var UserModel = mongoose.model('UserRequestModel', UserSchema );

module.exports = UserModel;