// create express route
const express = require("express");
const {
  getAllBlogs,
  getSingleBlog,
  getShowCaseBlogs,
  searchBlogs,
} = require("../controllers/blogController");

const router = express.Router();

router.get("/all-blogs", getAllBlogs);
router.get("/single-blog/:id", getSingleBlog);
router.get("/get-showcase-blogs", getShowCaseBlogs);
router.post("/search", searchBlogs);

module.exports = router;
