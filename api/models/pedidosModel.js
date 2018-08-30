// MODEL
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PedidosSchema = new Schema({
  _id: {type: String}
});


module.exports = mongoose.model('pedido', PedidosSchema);




