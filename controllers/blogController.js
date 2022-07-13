// create express controller
const Blog = require("../models/Blog");
const shuffle = require("../utils/shuffleArray");

// @desc   - get all blogs list
// @route  - POST /api/blog/all-blogs
// @access - Public, User
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;
    const blogs = await Blog.find()
      .select("image title blogView commentCount")
      .limit(pageSize)
      .skip((page - 1) * pageSize);
    const blogsCount = await Blog.countDocuments();
    const pages = Math.ceil(blogsCount / pageSize);

    res.json({ success: true, blogs, page, totalPages: pages, blogsCount });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - get single blog
// @route  - POST /api/blog/single-blog/:id
// @access - Public, User
exports.getSingleBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById({ _id: id });
    blog.blogView += 1;
    await blog.save();

    let image = blog.image["url"];
    if (!blog) {
      res.json({ success: false, message: "blog not found." });
    }
    res.json({ success: true, blog, image });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - get showcase blogs
// @route  - POST /api/blog/get-showcase-blogs
// @access - Public, User
exports.getShowCaseBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .select("image title blogView commentCount")
      .limit(3)
      .sort("-createdAt");
    let shuffleBlogs = shuffle(blogs);
    res.json({ success: true, blogs: shuffleBlogs });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Search blogs
// @route  - POST /api/blog/search
// @access - Public, User]
exports.searchBlogs = async (req, res) => {
  const searchText = req.body.searchText;
  try {
    const results = await Blog.find({
      title: { $regex: searchText, $options: "i" },
    }).select("image title blogView commentCount");
    res.json({ success: true, results });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
};
