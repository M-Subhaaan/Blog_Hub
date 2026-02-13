const express = require("express");
const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");
const router = express.Router();

router.get("/blog/:id/comments", commentController.getAllComments);

router.use(authController.protect);

router.post(
  "/blog/:id/comment",
  authController.restrictTo("user"),
  commentController.createComment,
);

router.patch(
  "/blog/:id/comment",
  authController.restrictTo("user"),
  commentController.updateComment,
);

router.delete(
  "/:id",
  authController.restrictTo("admin"),
  commentController.deleteComment,
);

module.exports = router;
