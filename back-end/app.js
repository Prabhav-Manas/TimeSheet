const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

dotenv.config();

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/empAttendance")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("back-end/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Orign, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
