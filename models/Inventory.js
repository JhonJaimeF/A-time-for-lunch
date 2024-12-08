const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const {Schema} = mongoose;

const SchemaInventory = new Schema({
  externalId: { 
    type: Number, 
    unique: true 
  },
  product : {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required : true,
  },  
  quantity: { 
    type: Number, 
    required: true,
    min : 0 
  },
  
})

SchemaInventory.plugin(AutoIncrement, { inc_field: 'externalId'});

const Inventory = mongoose.model('Inventory',SchemaInventory,);
module.exports = Inventory;