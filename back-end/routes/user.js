const express = require("express");
const UserController = require("../controllers/user");

const extractFile = require("../middleware/file");

const cors = require("cors");
const router = express.Router();
router.use(cors());

// --- SignUp ---
router.post("/signup", extractFile, UserController.createUser);

// --- LogIn ---
router.post("/login", UserController.userLogIn);

module.exports = router;
