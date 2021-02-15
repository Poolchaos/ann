var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UserRequestSchema = new Schema({
  token: String,
  role: String
}, { collection : 'users' });

module.exports = UserRequestSchema;