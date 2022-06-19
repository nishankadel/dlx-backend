// create express controller
// Import here
const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select(
      "name brand price image onStock id"
    );
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
