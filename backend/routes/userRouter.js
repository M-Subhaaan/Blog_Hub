const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", authController.signUp);
router.post("/admin/signup", authController.adminSignUp);
router.post("/login", authController.login);
router.post("/forget-password", authController.forgetPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/updatepassword", authController.updatePassword);
router.post("/logout", authController.logout);

router.delete(
  "/delete-user/:id",
  authController.restrictTo("admin"),
  userController.deleteUser,
);

router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllUsers,
);

module.exports = router;
