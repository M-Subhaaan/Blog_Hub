const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A User must have a Name"],
      uppercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please Provide a Valid Email Address"],
    },
    password: {
      type: String,
      required: true,
      select: false,
      minLength: [8, "Password should have 8 Characters"],
    },
    changedPasswordAt: Date,
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  { timestamps: true },
);

// Only set changedPasswordAt when an existing user changes their password (not on first signup)
userSchema.pre("save", function () {
  if (!this.isModified("password") || this.isNew) {
    return;
  }
  this.changedPasswordAt = Date.now();
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
