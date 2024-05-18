const express = require("express");
const authMiddleware = require("../middleware/check-auth");

const PostController = require("../controllers/posts");

const router = express.Router();

// --- Save Attendance ---
router.post("", authMiddleware, PostController.createAttendance);

// --- Fetch Attendance ---
router.get("", authMiddleware, PostController.getAttendance);

// --- Update Attendance ---
router.put("/:id", authMiddleware, PostController.updateAtendance);

// --- Delete Attendance ---
router.delete("/:id", authMiddleware, PostController.deleteAttendance);

module.exports = router;
