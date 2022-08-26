const mongoose = require("mongoose");

const LabtestSchema = mongoose.Schema({
  // write schemas here
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  labtestType: {
    type: String,
  },
  duration: {
    type: Date,
  },
  status: {
    type: String,
    default: "Pending",
  },
  result: {
    type: String,
    default: "Not Checked",
  },
  feedback: {
    type: String,
  },
});

const Labtest = mongoose.model("Labtest", LabtestSchema);

module.exports = Labtest;
