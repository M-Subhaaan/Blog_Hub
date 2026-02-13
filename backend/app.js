const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const blogRouter = require("./routes/blogRouter");
const reactionRouter = require("./routes/reactionRouter");
const commentRouter = require("./routes/commentRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorControler");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
    credentials: true,
  }),
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/reactions", reactionRouter);
app.use("/api/v1/comments", commentRouter);

app.use((req, res, next) => {
  return next(
    AppError(`Unable to find ${req.originalUrl} on this Server`, 400),
  );
});

app.use(globalErrorHandler);

module.exports = app;
