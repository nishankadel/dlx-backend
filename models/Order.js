const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  // write schemas here

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  productId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
  orderAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Placed",
  },
  payType: {
    type: String,
  },
  paidBy: {
    type: String,
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
