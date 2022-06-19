// create route for user
const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/userController");
const { checkUser } = require("../middlewares/auth");

router.get("/profile", checkUser, getUserProfile);

module.exports = router;
