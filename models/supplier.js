const mongoose = require('mongoose');
const Product = require('./product');

const { Schema } = mongoose;

const supplierSchema = new Schema({
  externalId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
  },
  Product : [
    {
      type: Schema.Types.ObjectId,
      ref: 'product'
    }

  ],


  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
