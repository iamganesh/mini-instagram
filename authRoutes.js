const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./user");

const router = express.Router();

router.get("/register", (req, res) => res.render("register"));
router.get("/login", (req, res) => res.render("login"));

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email: (email || "").toLowerCase() });
    if (exist) {
      req.flash("error", "Email already exists");
      return res.redirect("/register");
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });

    req.flash("success", "Registered! Now login.");
    res.redirect("/login");
  } catch {
    req.flash("error", "Register failed");
    res.redirect("/register");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });
    res.cookie("token", token, { httpOnly: true });

    req.flash("success", "Login success!");
    res.redirect("/dashboard");
  } catch {
    req.flash("error", "Login failed");
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  req.flash("success", "Logged out");
  res.redirect("/login");
});

module.exports = router;