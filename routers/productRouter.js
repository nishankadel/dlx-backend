// create express route
const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  getShowCaseProducts,
  addToFavorite,
  getFavorites,
  deleteFavorite,
  addToCart,
  getCart,
  clearCart,
  increaseCart,
  decreaseCart,
  deleteCart,
  searchProducts,
  orderHistory,
} = require("../controllers/productController");
const { checkUser } = require("../middlewares/auth");

const router = express.Router();

router.get("/all-products", getAllProducts);
router.get("/get-showcase-products", getShowCaseProducts);
router.get("/single-product/:id", getSingleProduct);
router.post("/add-to-favorite", checkUser, addToFavorite);
router.post("/add-to-cart", checkUser, addToCart);
router.post("/get-favorites", checkUser, getFavorites);
router.post("/get-cart", checkUser, getCart);
router.post("/delete-favorite", checkUser, deleteFavorite);
router.post("/delete-cart", checkUser, deleteCart);
router.post("/clear-cart", checkUser, clearCart);
router.post("/increase-cart", checkUser, increaseCart);
router.post("/decrease-cart", checkUser, decreaseCart);
router.post("/order-history", checkUser, orderHistory);
router.post("/search", searchProducts);
module.exports = router;
