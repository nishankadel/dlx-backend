const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
  // write schemas here
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  blogView: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  image: {
    cloudinaryId: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
