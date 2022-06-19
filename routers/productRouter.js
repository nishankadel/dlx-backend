// create express route
const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/all-products", getAllProducts);
router.get("/single-product/:id", getSingleProduct);

module.exports = router;
