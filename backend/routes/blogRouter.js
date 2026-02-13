const express = require("express");
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getSingleBlog);
router.get("/topic/:topic", blogController.getBlogsByTopic);

router.use(authController.protect);

router.post("/", authController.restrictTo("admin"), blogController.createBlog);
router.patch(
  "/updateblog/:id",
  authController.restrictTo("admin"),
  blogController.updateBlog,
);

router.delete(
  "/deleteblog/:id",
  authController.restrictTo("admin"),
  blogController.deleteBlog,
);
module.exports = router;
