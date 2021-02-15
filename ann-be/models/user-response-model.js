const mongoose = require('mongoose');
const UserResponseSchema = require('../schemas/user-response-schema');

// Compile model from schema
var UserResponseModel = mongoose.model('UserResponseModel', UserResponseSchema );

module.exports = UserResponseModel;