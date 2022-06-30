// create express route
const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  getShowCaseProducts,
  addToFavorite,
  getFavorites,
  deleteFavorite,
} = require("../controllers/productController");
const { checkUser } = require("../middlewares/auth");

const router = express.Router();

router.get("/all-products", getAllProducts);
router.get("/get-showcase-products", getShowCaseProducts);
router.get("/single-product/:id", getSingleProduct);
router.post("/add-to-favorite", checkUser, addToFavorite);
router.post("/get-favorites", checkUser, getFavorites);
router.post("/delete-favorite", checkUser, deleteFavorite);

module.exports = router;
