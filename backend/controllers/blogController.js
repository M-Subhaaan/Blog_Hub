const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllBlogs = catchAsync(async (req, res) => {
  const blogs = await Blog.find();

  res.status(200).json({
    status: "Success",
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.getSingleBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const blog = await Blog.findById(id).populate("author", "name email role");

  if (!blog) {
    return next(AppError("No Blog Found with that ID", 200));
  }

  res.status(200).json({
    status: "Success",
    data: {
      blog,
    },
  });
});

exports.getBlogsByTopic = catchAsync(async (req, res, next) => {
  const topic = req.params.topic;

  const blogs = await Blog.find({ topic });

  if (!blogs) {
    return next(AppError("No Blogs Found with That Topic", 400));
  }

  res.status(200).json({
    status: "Success",
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.createBlog = catchAsync(async (req, res) => {
  const { title, content, topic } = req.body;

  const blog = await Blog.create({
    title,
    content,
    topic,
    author: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { title, content } = req.body;

  const blog = await Blog.findByIdAndUpdate(
    id,
    { title, content },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!blog) {
    return next(AppError("No Blog Found with That ID", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    return next(AppError("No Blog Found with That ID", 400));
  }

  res.status(204).json({
    status: "Success",
    message: "Blog Deleted Successfuly",
  });
});
