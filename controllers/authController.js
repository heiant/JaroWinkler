// controllers/authController.js
const passport = require("passport");
const User = require("../models/User");

exports.getLogin = (req, res) => {
  res.render("auth/login");
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "Anda telah logout");
    res.redirect("/login");
  });
};
//test
