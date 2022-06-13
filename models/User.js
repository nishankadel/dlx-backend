const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  // write schemas here
  fullname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
