// Import essential modules/packages here
const Product = require("../models/Product");
const Favorite = require("../models/Favorite");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const axios = require("axios");
require("dotenv").config();

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

// @desc   - Add product to cart
// @route  - POST /api/product/add-to-cart
// @access - Private, User
exports.addToCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const product = await Product.findById({ _id: productId });
    let totalPrice = 0;
    if (!product) {
      return res.json({ success: false, message: "Product not found." });
    }

    const existingCart = await Cart.findOne({
      userId: userId,
      cart: { $elemMatch: { productId: productId } },
    });

    const myCart = await Cart.findOne({
      userId: userId,
    });

    console.log(myCart);
    if (myCart) {
      myCart.cart.forEach((item) => {
        totalPrice += item.unitPrice;
      });

      console.log(totalPrice);
    }
    if (existingCart) {
      return res.json({
        success: false,
        message: "Product already in cart.",
      });
    } else {
      const user = await Cart.findOne({ userId: userId });
      if (user) {
        await Cart.findOneAndUpdate(
          { userId: userId },
          {
            $push: {
              cart: {
                $each: [
                  {
                    unitPrice: parseInt(product.price),
                    productId: productId,
                    unitTotalPrice: parseInt(product.price),
                  },
                ],
              },
            },
            $inc: { totalPrice: parseInt(product.price) },
          },
          { new: true }
        );
        return res.json({
          success: true,
          message: "Product added to cart successfully.",
        });
      } else {
        const cart = await new Cart({
          userId: userId,
          cart: [
            {
              productId: productId,
              unitPrice: parseInt(product.price),
              unitTotalPrice: parseInt(product.price),
            },
          ],
          totalPrice: parseInt(product.price),
        });
        await cart.save();
        return res.json({
          success: true,
          message: "Product added in cart successfully.",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Get product from cart
// @route  - POST /api/product/get-cart
// @access - Private, User
exports.getCart = async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId: userId }).populate({
      path: "cart.productId",
      model: "Product",
      select: "name image onStock",
    });
    if (cart) {
      res.json({ success: true, cart, totalPrice: cart.totalPrice });
    } else {
      res.json({ success: false, message: "No cart found." });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Clear all product from cart
// @route  - POST /api/product/clear-cart
// @access - Private, User
exports.clearCart = async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      res.json({ success: false, message: "No cart found." });
    } else {
      await Cart.findOneAndDelete({ userId: userId });
      res.json({ success: true, message: "Cart cleared successfully." });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Decrease product quantity from cart
// @route  - POST /api/product/increase-cart
// @access - Private, User
exports.increaseCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cartProduct = await Cart.findOne({
      userId,
    });
    let unitPrice = 0;
    cartProduct.cart.forEach((element) => {
      if (String(element.productId) === String(productId)) {
        element.quantity += 1;
        element.unitTotalPrice += element.unitPrice;
        unitPrice = element.unitPrice;
        cartProduct.save();
      }
    });
    let totalPrice = 0;
    const myCart = await Cart.findOne({
      userId: userId,
    });
    // console.log(myCart);
    if (myCart) {
      myCart.cart.forEach((item) => {
        // console.log(item.unitPrice);
        totalPrice += item.unitTotalPrice;
      });

      console.log(totalPrice);

      await Cart.findOneAndUpdate(
        { userId: userId },
        { totalPrice: totalPrice + unitPrice },
        { new: true }
      );
    }
    res.json({
      success: true,
      message: "Cart quantity updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Decrease product quantity from cart
// @route  - POST /api/product/decrease-cart
// @access - Private, User
exports.decreaseCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cartProduct = await Cart.findOne({
      userId,
    });

    let unitPrice = 0;

    cartProduct.cart.forEach((element) => {
      if (String(element.productId) === String(productId)) {
        element.quantity -= 1;
        element.unitTotalPrice -= element.unitPrice;
        unitPrice = element.unitPrice;
        cartProduct.save();
      }
    });
    let totalPrice = 0;
    const myCart = await Cart.findOne({
      userId: userId,
    });

    if (myCart) {
      myCart.cart.forEach((item) => {
        totalPrice += item.unitTotalPrice;
      });

      await Cart.findOneAndUpdate(
        { userId: userId },
        { totalPrice: totalPrice - unitPrice },
        { new: true }
      );
    }
    res.json({
      success: true,
      message: "Cart quantity updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Delete product from cart
// @route  - POST /api/product/delete-cart
// @access - Private, User
exports.deleteCart = async (req, res) => {
  const { id, userId } = req.body;
  try {
    const cartProduct = await Cart.findOne({
      userId,
      productId: id,
    });
    let unitTotalPrice = 0;
    cartProduct.cart.forEach((item) => {
      if (String(item.productId) === String(id)) {
        unitTotalPrice = item.unitTotalPrice;
      }
    });

    await Cart.findOneAndUpdate(
      { userId: userId },
      {
        $pull: { cart: { productId: id } },
        $inc: { totalPrice: -unitTotalPrice },
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Product deleted from cart successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Search products
// @route  - POST /api/product/search
// @access - Public, User
exports.searchProducts = async (req, res) => {
  const searchText = req.body.searchText;
  try {
    const results = await Product.find({
      name: { $regex: searchText, $options: "i" },
    }).select("name brand price image onStock id");
    res.json({ success: true, results });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Add order history
// @route  - POST /api/product/order-history
// @access - Pivate, User
exports.orderHistory = async (req, res) => {
  const { userId, token, amount, cartProductId, totalPrice } = req.body;
  try {
    let data = {
      token: token,
      amount: amount,
    };

    let config = {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      },
    };

    await axios
      .post("https://khalti.com/api/v2/payment/verify/", data, config)
      .then((response) => {
        const order = new Order({
          userId: userId,
          productId: [...cartProductId],
          totalPrice: totalPrice,
          payType: response.data.type.name,
          paidBy: response.data.user.name,
        });
        order.save();
        res.json({ success: true, message: "Khalti Payment Successful" });
      })
      .catch((error) => {
        console.log(error);
        res.json({ success: false, message: "Error verifying payment." });
      });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
};
