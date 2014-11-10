/**
 * Created by nirum on 11/8/14.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/expts');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/*
 * --------------
 * Results Schema
 * --------------
 *
 * Contains a row of results for a given experiment.
 * The exptname is a String corresponding to an experiment stored in Metadata. The data array is an array of mixed
 * types containing results from a given simulation step / time.
 *
 */
var resultSchema = mongoose.Schema({
    _id: Number,
    exptname: String,
    date: Date,
    data: []
}, { collection: 'results' });

module.exports = mongoose.model('Result', resultSchema);