var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var RegistrationSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'No identifier specified']
  },
  firstName: String,
  surname: String,
  email: {
    type: String,
    required: [true, 'No email specified']
  },
  number: String,
  roles: [String]
}, { collection : 'registration' });

module.exports = RegistrationSchema;