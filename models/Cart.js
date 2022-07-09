const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  // write schemas here
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
      unitPrice: {
        type: Number,
      },
      unitTotalPrice: {
        type: Number,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
