// import here
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendToken } = require("../utils/jwtToken");
require("dotenv").config();

// @desc   - Login to account
// @route  - POST /api/auth/login
// @access - Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.json({
        success: false,
        message: "Email doesn't exist.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = sendToken(existingUser._id);

    return res.json({
      success: true,
      message: "Logged in successfully.",
      user: existingUser,
      token,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
    console.log(error);
  }
};

// @desc   - Register a new user
// @route  - POST /api/auth/register
// @access - Public
exports.register = async (req, res) => {
  const {
    fullname,
    email,
    phonenumber,
    fulladdress,
    dob,
    gender,
    password,
    confirmpassword,
  } = req.body;
  try {
    const passwordRegeex = new RegExp(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    );
    const phoneRegex = new RegExp(/98[0-9]{8}$/);
    const existingUser = await User.findOne({ email });
    if (fullname.length < 3) {
      return res.json({
        success: false,
        message: "Name requires atleast 3 characters.",
      });
    } else if (password !== confirmpassword) {
      return res.json({ success: false, message: "Passwords did not match." });
    } else if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password requires atleast 8 characters.",
      });
    } else if (passwordRegeex.test(password) == false) {
      return res.json({
        success: false,
        message:
          "Password requires one uppercase, one lowercase and one special character.",
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
    } else if (existingUser) {
      return res.json({
        success: false,
        message: "This email is already registered.",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        fullname,
        email,
        phonenumber,
        fulladdress,
        dob,
        gender,
        password: hashedPassword,
      });
      await user.save();
      const token = sendToken(user._id);
      res.json({
        success: true,
        message: "User registered successfully.",
        user,
        token,
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
