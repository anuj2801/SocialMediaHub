const express = require("express");
const {
  register,
  login,
  followandUnfollowUser,
  logout,
  updatePassword,
  updateProfile,
  deleteMyProfile,
} = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/follow/:id").get(isAuthenticated, followandUnfollowUser);

router.route("/update/password").put(isAuthenticated, updatePassword);

router.route("/update/profile").put(isAuthenticated, updateProfile);

router.route("/update/profile").put(isAuthenticated, updateProfile);

router.route("/delete/me").put(isAuthenticated, deleteMyProfile);

module.exports = router;
