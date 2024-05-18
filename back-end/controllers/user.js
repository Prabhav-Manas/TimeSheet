const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// --- CreateUser ---
exports.createUser = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  // Check if password is present in request body
  if (!req.body.password) {
    return res.status(400).json({ message: "Password is required" });
  }
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      imagePath: req.file ? url + "/image/" + req.file.filename : null,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
};

// --- LogInUser ---
exports.userLogIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      "secret_this_should_be_longer",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token: token,
      expiresIn: 3600,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An internal server error occurred.",
    });
  }
};
