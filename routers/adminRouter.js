// create express route
const express = require("express");
const {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminController");
const { checkAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/add-product", upload.single("image"), checkAdmin, addProduct);
router.get("/all-products", checkAdmin, getAllProducts);
router.get("/single-product/:id", checkAdmin, getSingleProduct);
router.get("/update-product/:id", checkAdmin, updateProduct);
router.get("/delete-product/:id", checkAdmin, deleteProduct);

module.exports = router;
