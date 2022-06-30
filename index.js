// Importing required modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./db/connection");
const cookieParser = require("cookie-parser");

// create app server
const app = express();

// create port variables
const port = process.env.PORT || 8000;

// Setup cors middlewares
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://drug-loft-xpress.herokuapp.com",
    ],
  })
);

// use express parsers
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

// using other middlewares
app.use(morgan("tiny"));

// using cookie parser
app.use(cookieParser());

// setting up router
app.use("/api/auth/", require("./routers/authRouter"));
app.use("/api/user/", require("./routers/userRouter"));
app.use("/api/product/", require("./routers/productRouter"));
app.use("/api/blog/", require("./routers/blogRouter"));
app.use("/api/admin/", require("./routers/adminRouter"));
app.use("/api/comment/", require("./routers/commentRouter"));

app.get("*", (req, res) =>
  res
    .status(200)
    .json({ success: false, message: "This endpoint is not available" })
);

// running server
app.listen(port, () => console.log(`Backend Server Running at ${port}`));
