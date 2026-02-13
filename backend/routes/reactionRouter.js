const express = require("express");
const authController = require("../controllers/authController");
const reactionController = require("../controllers/reactionController");
const router = express.Router();

router.use(authController.protect);

router.post(
  "/blog/:id/like",
  authController.restrictTo("user"),
  reactionController.likeBlog,
);

router.post(
  "/blog/:id/dislike",
  authController.restrictTo("user"),
  reactionController.dislikeBlog,
);

router.delete(
  "/blog/:id/reaction",
  authController.restrictTo("user"),
  reactionController.deleteReaction,
);
module.exports = router;
