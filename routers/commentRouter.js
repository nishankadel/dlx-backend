// create route for user
const express = require("express");
const router = express.Router();
const {
  addComment,
  getComment,
  deleteComment,
} = require("../controllers/commentController");
const { checkUser } = require("../middlewares/auth");

router.post("/add-comment/:id", checkUser, addComment);
router.get("/get-comment/:id", getComment);
router.post("/delete-comment/:id", checkUser, deleteComment);

module.exports = router;
