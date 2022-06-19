// create express controller
// Import here
const cloudinary = require("../middlewares/cloudinary");
const Product = require("../models/Product");

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

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
    }
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

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

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `Product deleted successfully.`,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Something went wrong" });
  }
};
