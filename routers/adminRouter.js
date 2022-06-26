// create express route
const express = require("express");
const {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  deleteUser,
  addBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  login,
  getDashboard,
} = require("../controllers/adminController");
const { checkAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/login", login);

// x--------------x-----------------------PRODUCTS----------------x----------------x
router.post("/add-product", upload.single("image"), checkAdmin, addProduct);
router.get("/all-products", checkAdmin, getAllProducts);
router.get("/single-product/:id", checkAdmin, getSingleProduct);
router.post("/update-product/:id", checkAdmin, updateProduct);
router.post("/delete-product/:id", checkAdmin, deleteProduct);
// x--------------x-----------------------PRODUCTS----------------x----------------x

// x--------------x-----------------------USERS----------------x----------------x
router.get("/all-users", checkAdmin, getAllUsers);
router.post("/delete-user/:id", checkAdmin, deleteUser);
// x--------------x-----------------------USERS----------------x----------------x

// x--------------x-----------------------BLOGS----------------x----------------x
router.post("/add-blog", upload.single("image"), checkAdmin, addBlog);
router.get("/all-blogs", checkAdmin, getAllBlogs);
router.get("/single-blog/:id", checkAdmin, getSingleBlog);
router.post("/update-blog/:id", checkAdmin, updateBlog);
router.post("/delete-blog/:id", checkAdmin, deleteBlog);
// x--------------x-----------------------BLOGS----------------x----------------x

// x--------------x-----------------------DASHBOARD----------------x----------------x
router.get("/dashboard", checkAdmin, getDashboard);
// x--------------x-----------------------DASHBOARD----------------x----------------x

module.exports = router;
