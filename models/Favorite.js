const mongoose = require("mongoose");

const FavoriteSchema = mongoose.Schema({
  // write schemas here
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  favorite: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
});

const Favorite = mongoose.model("Favorite", FavoriteSchema);

module.exports = Favorite;
