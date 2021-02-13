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
  email: String,
  contactNumbers: [String]
}, { collection : 'registration' });

module.exports = RegistrationSchema;