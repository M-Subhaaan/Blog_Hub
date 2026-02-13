const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(AppError("User not Found with the Provided ID", 400));
  }
  res.status(204).json({
    status: "Success",
    message: "User Deleted Successfuly",
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "Success",
    results: users.length,
    data: {
      users,
    },
  });
});
