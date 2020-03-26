// MODEL
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ControlSchema = new Schema({
  _id: {type: String},
  timestamp: {type: Date}
},
{
  collection: 'control'
});

module.exports = mongoose.model('control', ControlSchema);


