// Import essential modules/packages here
const User = require("../models/User");
const { sendEmail } = require("../middlewares/sendEmail");
const Feedback = require("../models/Feedback");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");

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

// @desc   - Post feedback
// @route  - POST /api/user/feedback
// @access - Private, User
exports.sendFeedback = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const feedback = await new Feedback({ name, email, message });
    await feedback
      .save()
      .then((response) => {
        res.json({ success: true, message: "Feedback sent successfully" });
        sendEmail(email, "d-c65754fe09704baaabd4d6aacdb436ce", name, "");
      })
      .catch((err) => {
        console.log(err);
        res.json({ success: false, message: "Something went wrong" });
      });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// @desc   - Get order history
// @route  - POST /api/user/order-history
// @access - Private, User
exports.orderHistory = async (req, res) => {
  const { userId } = req.body;
  try {
    const userOrder = await Order.find({ userId: userId });
    res.json({ success: true, userOrder });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// @desc   - Get order Details
// @route  - POST /api/user/order-details
// @access - Private, User
exports.orderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const userOrder = await Order.findOne({ _id: id }).populate({
      path: "productId",
      model: "Product",
      select: "name image price",
    });
    res.json({ success: true, userOrder });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// @desc   - Update Profile
// @route  - POST /api/user/update-profile
// @access - Private, User
exports.updateProfile = async (req, res) => {
  const { fullname, phonenumber, id, fulladdress, dob, gender } = req.body;
  try {
    const phoneRegex = new RegExp(/98[0-9]{8}$/);
    if (fullname.length < 3) {
      return res.json({
        success: false,
        message: "Name requires atleast 3 characters.",
      });
    } else if (phonenumber.length < 10) {
      return res.json({
        success: false,
        message: "Phone number must be of 10 digits.",
      });
    } else if (phoneRegex.test(phonenumber) == false) {
      return res.json({
        success: false,
        message: "Phone number is invalid or not correct.",
      });
    } else {
      await User.findByIdAndUpdate(
        id,
        { fullname, fulladdress, phonenumber, dob, gender },
        {
          new: true,
        }
      );
      res.json({
        success: true,
        message: `User profile updated successfully.`,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
    console.log(error);
  }
};

// @desc   - Change Password
// @route  - POST /api/user/change-password
// @access - Private, User
exports.changePassword = async (req, res) => {
  const { id, currentPassword, newPassword, confirmNewPassword } = req.body;
  try {
    const passwordRegeex = new RegExp(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    );
    const user = await User.findById({ _id: id });
    const hashedPassword = bcrypt.compareSync(currentPassword, user.password);

    if (newPassword !== confirmNewPassword) {
      return res.json({
        success: false,
        message: "New passwords doesn't match.",
      });
    }
    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password requires atleast 8 characters.",
      });
    }
    if (passwordRegeex.test(newPassword) == false) {
      return res.json({
        success: false,
        message:
          "Password requires one uppercase, one lowercase and one special character.",
      });
    }
    if (hashedPassword === true) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(
        id,
        { password: newHashedPassword },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Password changed successfully. Login wirh new password.",
      });
    } else {
      return res.json({
        success: false,
        message: "Current password doesn't match.",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
    console.log(error);
  }
};
