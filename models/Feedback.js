const mongoose = require("mongoose");

const FeedbackSchema = mongoose.Schema({
  // write schemas here
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

module.exports = Feedback;
