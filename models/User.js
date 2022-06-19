const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  // write schemas here
  fullname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    maxlength: 50,
  },
  phonenumber: {
    type: Number,
    required: true,
    minlength: 10,
    maxlength: 13,
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  fulladdress: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dpng7p48z/image/upload/v1629169721/profiles/default_profile.png",
  },
  userType: {
    type: String,
    default: "User",
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
