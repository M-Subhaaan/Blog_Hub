const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A Blog must have a Title"],
      uppercase: true,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "A Blog must have a Content"],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, "A Blog must have a Topic"],
      enum: {
        values: ["tech", "health", "business", "islamic"],
        message:
          "Blog Topic is From one of These... tech, health, business, islamic",
      },
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A Blog must have a Author"],
    },

    likesCount: {
      type: Number,
      default: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
