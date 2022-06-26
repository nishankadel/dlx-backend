// Import essential modules/packages here
const cloudinary = require("../middlewares/cloudinary");
const Product = require("../models/Product");
const User = require("../models/User");
const Blog = require("../models/Blog");
const bcrypt = require("bcryptjs");
const { sendToken } = require("../utils/jwtToken");

// @desc   - Login to admin account
// @route  - POST /api/admin/login
// @access - Private, Admin
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.json({
        success: false,
        message: "Email doesn't exist.",
      });
    }

    if (existingUser && existingUser.userType === "Admin") {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordCorrect) {
        return res.json({
          success: false,
          message: "Invalid credentials.",
        });
      }

      const token = sendToken(existingUser._id);

      return res.json({
        success: true,
        message: "Admin Logged in successfully.",
        user: existingUser,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "You are not authorized.",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
    console.log(error);
  }
};

// x--------------x-----------------------PRODUCTS----------------x----------------x
// @route     GET api/admin/add-product
// @desc      Add product to database
// @access    Private, Admin
exports.addProduct = async (req, res) => {
  const {
    name,
    category,
    brand,
    description,
    price,
    uses,
    sideEffects,
    dosages,
    precaution,
    onStock,
  } = req.body;
  try {
    const output = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

    const product = await new Product({
      name: name,
      category: category,
      brand: brand,
      description: description,
      price: price,
      uses: uses,
      sideEffects: sideEffects,
      dosages: dosages,
      precaution: precaution,
      onStock: onStock,
      image: { cloudinaryId: output.public_id, url: output.secure_url },
    });

    await product.save();
    res
      .status(200)
      .json({ success: true, message: "Product added successfully.", product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @route     GET api/admin/all-products
// @desc      Get all products
// @access    Private, Admin
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select(
      "image name category price createdAt onStock"
    );
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @route     GET api/admin/single-product/:id
// @desc      Get single product from id
// @access    Private, Admin
exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    let image = product.image["url"];
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
    }
    res.status(200).json({ success: true, product, image });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @route     GET api/admin/update-product/:id
// @desc      Update product
// @access    Private, Admin
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: `Product updated successfully.`,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(404).json({ message: false, message: "Something went wrong" });
    console.log(error);
  }
};

// @route     GET api/admin/delete-product/:id
// @desc      Delete product from database
// @access    Private, Admin
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
    }
    cloudinary.uploader.destroy(product.image["cloudinaryId"]);

    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `Product deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Something went wrong" });
  }
};
// x--------------x-----------------------PRODUCTS----------------x----------------x

// x--------------x-----------------------USER----------------x----------------x
// @route     GET api/admin/all-users/
// @desc      Get all users list
// @access    Private, Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Something went wrong" });
  }
};

// @route     GET api/admin/delete-user/:id
// @desc      Delete user from database
// @access    Private, Admin
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById({ _id: id });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `User deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Something went wrong" });
  }
};
// x--------------x-----------------------USER----------------x----------------x

// x--------------x-----------------------BLOGS----------------x----------------x
// @route     GET api/admin/add-blog
// @desc      Add blog to database
// @access    Private, Admin
exports.addBlog = async (req, res) => {
  const { title, description } = req.body;
  try {
    const output = await cloudinary.uploader.upload(req.file.path, {
      folder: "blogs",
    });

    const blog = await new Blog({
      title,
      description,
      image: { cloudinaryId: output.public_id, url: output.secure_url },
    });

    await blog.save();
    res
      .status(200)
      .json({ success: true, message: "Blog added successfully.", blog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @route     GET api/admin/all-blogs
// @desc      Get all blogs
// @access    Private, Admin
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().select("image title description");
    res.status(200).json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @route     GET api/admin/single-blog/:id
// @desc      Get single blog from id
// @access    Private, Admin
exports.getSingleBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById({ _id: id });
    let image = blog.image["url"];
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found." });
    }
    res.status(200).json({ success: true, blog, image });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @route     GET api/admin/update-blog/:id
// @desc      Update blog
// @access    Private, Admin
exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById({ _id: id });

    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found." });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: `Blog updated successfully.`,
      product: updatedBlog,
    });
  } catch (error) {
    res.status(404).json({ message: false, message: "Something went wrong" });
    console.log(error);
  }
};

// @route     GET api/admin/delete-blog/:id
// @desc      Delete blog from database
// @access    Private, Admin
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById({ _id: id });
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found." });
    }
    cloudinary.uploader.destroy(product.image["cloudinaryId"]);
    await Blog.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `Blog deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Something went wrong" });
  }
};
// x--------------x-----------------------BLOGS----------------x----------------x

// x--------------x-----------------------DASHBOARD----------------x----------------x
// @route     GET api/admin/dashboad
// @desc      Delete dashboaard from database
// @access    Private, Admin
exports.getDashboard = async (req, res) => {
  //   all_users,
  //   all_products,
  //   all_orders_list,
  //   all_blogs_list,
  //   all_feedback_list,
  //   all_labtest_list,
  //   all_medical_request_list,
  //   all_uploaded_prescription_list,
  //   all_specialist_list,
  //   all_appointment_list;

  try {
    const all_users = await User.find().countDocuments();
    const all_products = await Product.find().countDocuments();
    const all_blogs_list = await Blog.find().countDocuments();
    return res.status(200).json({
      success: true,
      all_users,
      all_products,
      all_blogs_list,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Something went wrong" });
  }
};
// x--------------x-----------------------DASHBOARD----------------x----------------x
