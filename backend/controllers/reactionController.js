const Reaction = require("../models/reactionModel");
const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.likeBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user._id;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return next(AppError("No Blog Found with that ID", 400));
  }

  const existingReaction = await Reaction.findOne({
    blog: blogId,
    user: userId,
  });

  if (!existingReaction) {
    await Reaction.create({
      blog: blogId,
      user: userId,
      type: "like",
    });

    blog.likesCount += 1;
    await blog.save();

    return res.status(201).json({
      status: "success",
      message: "Blog liked",
    });
  }

  if (existingReaction.type === "like") {
    await existingReaction.deleteOne();

    blog.likesCount -= 1;
    await blog.save();

    return res.status(200).json({
      status: "success",
      message: "Like removed",
    });
  }

  if (existingReaction.type === "dislike") {
    existingReaction.type = "like";
    await existingReaction.save();

    blog.dislikesCount -= 1;
    blog.likesCount += 1;
    await blog.save();

    return res.status(200).json({
      status: "success",
      message: "Changed to like",
    });
  }
});

exports.dislikeBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user._id;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return next(AppError("No Blog Found with that ID", 400));
  }

  const existingReaction = await Reaction.findOne({
    blog: blogId,
    user: userId,
  });

  if (!existingReaction) {
    await Reaction.create({
      blog: blogId,
      user: userId,
      type: "dislike",
    });

    blog.dislikesCount += 1;
    await blog.save();

    return res.status(201).json({
      status: "success",
      message: "Blog disliked",
    });
  }

  if (existingReaction.type === "like") {
    existingReaction.type = "dislike";
    await existingReaction.save();

    blog.dislikesCount += 1;
    blog.likesCount -= 1;
    await blog.save();

    return res.status(200).json({
      status: "success",
      message: "Changed to dislike",
    });
  }

  if (existingReaction.type === "dislike") {
    await existingReaction.deleteOne();

    blog.dislikesCount -= 1;
    await blog.save();

    return res.status(200).json({
      status: "success",
      message: "Dislike removed",
    });
  }
});

exports.deleteReaction = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user._id;

  const reaction = await Reaction.findOne({
    blog: blogId,
    user: userId,
  });

  if (!reaction) {
    return next(AppError("No Reaction Found", 404));
  }

  const blog = await Blog.findById(blogId);

  if (reaction.type === "like") blog.likesCount -= 1;
  if (reaction.type === "dislike") blog.dislikesCount -= 1;

  await reaction.deleteOne();
  await blog.save();

  res.status(200).json({
    status: "success",
    message: "Reaction removed",
  });
});
