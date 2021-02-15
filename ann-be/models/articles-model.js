const mongoose = require('mongoose');

const { ArticleRequestSchema, ArticleResponseSchema } = require('../schemas/articles-schema');

var ArticleRequestModel = mongoose.model('ArticleRequestModel', ArticleRequestSchema);
var ArticleResponseModel = mongoose.model('ArticleResponseModel', ArticleResponseSchema);

module.exports = { ArticleResponseModel, ArticleRequestModel };