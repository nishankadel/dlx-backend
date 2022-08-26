// create express controller
// Import here
const Labtest = require("../models/Labtest");
const { sendEmail } = require("../middlewares/sendEmail");
const User = require("../models/User");

exports.bookLabtest = async (req, res) => {
  const { userId, labtestType, duration } = req.body;
  try {
    if (labtestType === "" || duration === "" || !labtestType || !duration) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    } else {
      const user = await User.findById(userId);
      const labtest = new Labtest({
        userId: userId,
        labtestType: labtestType,
        duration: duration,
      });
      await labtest.save();

      sendEmail(
        user.email,
        "d-619e4c37f0c04e37bf5ea0619dedccb5",
        user.fullname,
        duration
      );
      return res.json({
        success: true,
        message: "Labtest booked successfully.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
};

exports.getLabtest = async (req, res) => {
  const { userId } = req.params;
  try {
    const labtests = await Labtest.find({ userId: userId });
    return res.json({ success: true, labtests });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
};
