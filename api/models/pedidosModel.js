// MODEL

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PedidosSchema = new Schema({
  _id: { type: String },
  descartado: { type: Boolean },
  eventos: { type: [] }
});


var Fedicom2Schema = new Schema({
  _id: { type: String }
});


mongoose.model('pedido', PedidosSchema);
mongoose.model('fedicom2', Fedicom2Schema);
