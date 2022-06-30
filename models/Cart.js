const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  // write schemas here
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cartCount: {
    type: Number,
    default: 0,
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
