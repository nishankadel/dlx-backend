// create route for user
const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  sendFeedback,
  orderHistory,
  orderDetails,
  updateProfile,
} = require("../controllers/userController");
const { checkUser } = require("../middlewares/auth");

router.get("/profile", checkUser, getUserProfile);
router.post("/feedback", checkUser, sendFeedback);
router.post("/order-history", checkUser, orderHistory);
router.get("/order-details/:id", checkUser, orderDetails);
router.post("/update-profile", checkUser, updateProfile);

module.exports = router;
