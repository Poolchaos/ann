var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'No identifier specified.']
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'No userid specified.']
  },
  name: {
    type: String,
    required: [true, 'Please specify an article name.']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category.']
  },
  content: {
    type: String,
    required: [true, 'Please specify article content.']
  },
  createdTimestamp: [{
    content: String,
    type: String
  }],
  contentConfirmed: {
    type: Boolean,
    required: [true, 'Please validate whether content has been confirmed']
  },
  files: [Schema.Types.ObjectId]
}, { collection : 'articles' });

module.exports = ArticleSchema;