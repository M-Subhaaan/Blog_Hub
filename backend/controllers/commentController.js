const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllComments = catchAsync(async (req, res) => {
  const blogId = req.params.id;

  const comments = await Comment.find({ blog: blogId }).populate(
    "user",
    "name email",
  );

  res.status(200).json({
    status: "Success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user._id;

  const response = req.body.comment;

  if (!response) {
    return next(AppError("Please provide comment text", 400));
  }

  const existingComment = await Comment.findOne({ blog: blogId, user: userId });

  if (existingComment) {
    return next(AppError("You Already Have a Comment for This Blog", 400));
  }

  const comment = await Comment.create({
    blog: blogId,
    user: userId,
    comment: response,
  });

  res.status(201).json({
    status: "Success",
    data: {
      comment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user._id;

  const newCommentText = req.body.comment;

  if (!newCommentText) {
    return next(AppError("Please provide comment text", 400));
  }

  const comment = await Comment.findOne({
    blog: blogId,
    user: userId,
  });

  if (!comment) {
    return next(AppError("No Comment Found for this Blog", 404));
  }

  comment.comment = newCommentText;
  await comment.save();

  res.status(200).json({
    status: "Success",
    data: {
      comment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const comment = await Comment.findByIdAndDelete(id);

  if (!comment) {
    return next(AppError("No Comment Found with That ID"), 400);
  }

  res.status(204).json({
    status: "Success",
    message: "Comment Deleted Successfuly",
  });
});
