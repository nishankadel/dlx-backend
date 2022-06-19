const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  // write schemas here
  name: {
    type: String,
  },
  category: {
    type: String,
    default: "N/A",
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  productName: {
    type: String,
  },
  image: {
    cloudinaryId: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  brand: {
    type: String,
    default: "N/A",
  },
  uses: {
    type: String,
    default: "N/A",
  },
  sideEffects: {
    type: String,
    default: "N/A",
  },
  dosages: {
    type: String,
    default: "N/A",
  },
  precaution: {
    type: String,
    default: "N/A",
  },
  onStock: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
