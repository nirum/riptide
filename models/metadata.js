/**
 * Created by nirum on 11/9/14.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/expts');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/*
 * ---------------
 * Metadata Schema
 * ---------------
 *
 * Contains generic information for an experiment: the experiment name, description, and headers.
 * Headers is an array of strings describing the elements stored in the Data array of each Result
 *
 */
var metadataSchema = mongoose.Schema({
    name: String,
    desc: String,
    headers: [String],
    createdOn: Date
}, {collection: 'metadata'});

module.exports = mongoose.model('Metadata', metadataSchema);