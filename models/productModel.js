const mongoose = require('mongoose');

// This denotes the kind of data that is requested from the database
const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true
    },
    productQuantity: {
      type: Number,
      required: true
    },
    productPrice: {
      type: Number,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User' // Assuming you have a User model
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;