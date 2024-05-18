const Post = require("../models/post");

// --- Create Attendance ---
exports.createAttendance = (req, res, next) => {
  const posts = new Post({
    date: req.body.date,
    day: req.body.day,
    time: req.body.time,
    creator: req.userData.userId,
  });
  posts
    .save()
    .then((createdPosts) => {
      res.status(201).json({
        message: "Post added successfully!",
        postId: createdPosts._id,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Post Create Failed!",
      });
    });
};

// --- Fetch Attendance ---
exports.getAttendance = (req, res, next) => {
  const pageSize = +req.query.pageSize; // Add '+' to conver it into number
  const currentPage = +req.query.page; // Add '+' to conver it into number
  const postQuery = Post.find({ creator: req.userData.userId });
  let fetchedPosts = [];
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments({ creator: req.userData.userId });
    })
    .then((count) => {
      res.status(200).json({
        message: "Post successfull!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
};

// --- Update Attendance ---
exports.updateAtendance = (req, res, next) => {
  const postId = req.params.id;
  const updatedPost = {
    date: req.body.date,
    day: req.body.day,
    time: req.body.time,
  };
  Post.updateOne({ _id: postId }, { $set: updatedPost })
    .then((result) => {
      res.status(200).json({ message: "Update Successful!" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update post." });
    });
};

// --- Delete Attendance ---
exports.deleteAttendance = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({
      message: "Attendance Deleted!",
    });
  });
};
