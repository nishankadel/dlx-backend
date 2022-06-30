// Import essential modules/packages here
const Product = require("../models/Product");
const Favorite = require("../models/Favorite");

// @desc   - Get all products
// @route  - POST /api/product/all-products
// @access - Public, User
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;
    let products = await Product.find()
      .select("name brand price image onStock id")
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const productsCount = await Product.countDocuments();
    const pages = Math.ceil(productsCount / pageSize);
    res.json({
      success: true,
      products,
      page,
      totalPages: pages,
      productsCount,
    });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Get products in showcase
// @route  - POST /api/product/get-showcase-products
// @access - Public, User
exports.getShowCaseProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select("name brand price image onStock id")
      .limit(4)
      .sort("-createdAt");
    res.json({ success: true, products });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Get single product
// @route  - POST /api/product/single-product/:id
// @access - Public, User
exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    let image = product.image["url"];
    if (!product) {
      res.json({ success: false, message: "Product not found." });
    }
    res.json({ success: true, product, image });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Add product to favorite
// @route  - POST /api/product/add-to-favorite
// @access - Private, User
exports.addToFavorite = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const product = await Product.findById({ _id: productId });

    if (!product) {
      return res.json({ success: false, message: "Product not found." });
    }

    const existingFavorite = await Favorite.findOne({
      userId: userId,
      favorite: { $elemMatch: { productId: productId } },
    });

    if (existingFavorite) {
      return res.json({
        success: false,
        message: "Product already in favorite.",
      });
    } else {
      const user = await Favorite.findOne({ userId: userId });
      if (user) {
        await Favorite.findOneAndUpdate(
          { userId: userId },
          { $push: { favorite: { productId: productId } } },
          { new: true }
        );
        return res.json({
          success: true,
          message: "Product added to favorite successfully.",
        });
      } else {
        const favorite = await new Favorite({
          userId: userId,
          favorite: [
            {
              productId: productId,
            },
          ],
        });
        await favorite.save();
        return res.json({
          success: true,
          message: "Product added in favorite successfully.",
          favorite,
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Add product to favorite
// @route  - POST /api/product/add-to-favorite
// @access - Private, User
exports.addToFavorite = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const product = await Product.findById({ _id: productId });

    if (!product) {
      return res.json({ success: false, message: "Product not found." });
    }

    const existingFavorite = await Favorite.findOne({
      userId: userId,
      favorite: { $elemMatch: { productId: productId } },
    });

    if (existingFavorite) {
      return res.json({
        success: false,
        message: "Product already in favorite.",
      });
    } else {
      const user = await Favorite.findOne({ userId: userId });
      if (user) {
        await Favorite.findOneAndUpdate(
          { userId: userId },
          { $push: { favorite: { productId: productId } } },
          { new: true }
        );
        return res.json({
          success: true,
          message: "Product added to favorite successfully.",
        });
      } else {
        const favorite = await new Favorite({
          userId: userId,
          favorite: [
            {
              productId: productId,
            },
          ],
        });
        await favorite.save();
        return res.json({
          success: true,
          message: "Product added in favorite successfully.",
          favorite,
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Get product from favorite
// @route  - POST /api/product/get-favorites
// @access - Private, User
exports.getFavorites = async (req, res) => {
  const { userId } = req.body;
  try {
    const favorites = await Favorite.findOne({ userId: userId }).populate({
      path: "favorite.productId",
      model: "Product",
      select: "name image onStock",
    });
    if (favorites) {
      res.json({ success: true, favorites });
    } else {
      res.json({ success: false, message: "No favorites found." });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Delete product from favorite
// @route  - POST /api/product/delete-favorite
// @access - Private, User
exports.deleteFavorite = async (req, res) => {
  const { id, userId } = req.body;
  try {
    await Favorite.findOneAndUpdate(
      { userId: userId },
      { $pull: { favorite: { productId: id } } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Product deleted from favorite successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
};
