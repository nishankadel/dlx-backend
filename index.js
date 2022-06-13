// Importing required modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./db/connection");

// create app server
const app = express();

// create port variables
const port = process.env.PORT || 8000;

// use express parsers
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

// using other middlewares
app.use(morgan("tiny"));

// Setup cors middlewares
app.use(cors());

// setting up router
app.use("/api/auth/", require("./routers/authRouter"));

// running server
app.listen(port, () => console.log(`Backend Server Running at ${port}`));
