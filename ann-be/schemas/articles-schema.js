var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ArticleRequestSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'No identifier specified.']
  },
  name: {
    type: String,
    required: [true, 'Please specify an article name.']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category.']
  },
  files: [String]
}, { collection : 'articles' });

var ArticleResponseSchema = new Schema({
  articles: {
    _id: Schema.Types.ObjectId,
    name: String,
    category: String,
    files: [String]
  }
}, { collection : 'articles' });

module.exports = { ArticleRequestSchema, ArticleResponseSchema };