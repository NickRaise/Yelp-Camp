const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const userControl = require("../controllers/users");

router
  .route("/register")
  .get(userControl.renderRegister)
  .post(catchAsync(userControl.registerUser));

router
  .route("/login")
  .get(userControl.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userControl.loginUser
  );

router.get("/logout", userControl.logoutUser);

module.exports = router;
