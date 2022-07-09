// Import essential modules/packages hereconst Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const Product = require("../models/Product");
const Blog = require("../models/Blog");

// @desc   - add comment to products and blogs
// @route  - POST /api/comment/add-comment/:id
// @access - Private, User
exports.addComment = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    const blog = await Blog.findById(id);
    if (product) {
      const productComment = new Comment({
        userId: user._id,
        productId: product._id,
        comment: req.body.comment,
      });
      await productComment.save();
      return res.json({
        success: true,
        message: "Comment added successfully",
      });
    } else if (blog) {
      const blogComment = new Comment({
        userId: user._id,
        blogId: blog._id,
        comment: req.body.comment,
      });

      blog.commentCount += 1;
      await blog.save();
      await blogComment.save();
      return res.json({
        success: true,
        message: "Comment added successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Id is not valid",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - get comment to products and blogs
// @route  - POST /api/comment/get-comment/:id
// @access - Private, User
exports.getComment = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    const blog = await Blog.findById(id);
    if (product) {
      const comments = await Comment.find({ productId: id })
        .select("comment commentAt")
        .populate({ path: "userId", model: "User", select: "fullname avatar" });
      const productCommentCount = comments.length;
      return res.json({
        success: true,
        comments,
        commentsCount: productCommentCount,
      });
    } else if (blog) {
      const comments = await Comment.find({ blogId: id })
        .select("comment commentAt")
        .populate({ path: "userId", model: "User", select: "fullname avatar" });
      const blogCommentCount = comments.length;
      return res.json({
        success: true,
        message: "Comment added successfully",
        comments,
        commentsCount: blogCommentCount,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Id is not valid",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - delete comment from products and blogs
// @route  - POST /api/comment/delete-comment/:id
// @access - Private, User
exports.deleteComment = async (req, res) => {
  const { commentId } = req.body;
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    const blog = await Blog.findById(id);
    if (product) {
      product.commentCount -= 1;
      await Comment.findByIdAndDelete({ _id: commentId });
      await product.save();
      return res.json({
        success: true,
        message: "Comment deleted successfully",
      });
    } else if (blog) {
      await Comment.findByIdAndDelete({ _id: commentId });
      blog.commentCount -= 1;
      await blog.save();
      return res.json({
        success: true,
        message: "Comment deleted successfully",
      });
    } else {
      return res.json({
        success: false,
        message: "Id is not valid",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
};
