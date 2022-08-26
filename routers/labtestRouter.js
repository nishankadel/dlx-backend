// create express route
const express = require("express");
const { bookLabtest, getLabtest } = require("../controllers/labtestController");

const router = express.Router();

router.post("/book-labtest", bookLabtest);
router.get("/all-labtest/:userId", getLabtest);

module.exports = router;
