// Import essential modules/packages here
const User = require("../models/User");

// @desc   - Get user profile
// @route  - POST /api/user/profile
// @access - Private, User
exports.getUserProfile = async (req, res) => {
  const user = req.user;
  try {
    if (user) {
      return res.json({ success: true, user });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
    console.log(error);
  }
};
