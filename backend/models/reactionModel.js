const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Reaction must belong to a blog"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reaction must belong to a user"],
    },
    type: {
      type: String,
      enum: {
        values: ["like", "dislike"],
        message: "Reaction type must be either 'like' or 'dislike'",
      },
    },
  },
  { timestamps: true },
);

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
