// app/models/blogpost.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BlogSchema   = new Schema({
	title: String,
	isi: String,
	author: String
});

module.exports = mongoose.model('blogpost', BlogSchema);