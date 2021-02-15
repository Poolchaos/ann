const mongoose = require('mongoose');
const UserRequestSchema = require('../schemas/user-request-schema');

// Compile model from schema
var UserRequestModel = mongoose.model('UserRequestModel', UserRequestSchema );

module.exports = UserRequestModel;