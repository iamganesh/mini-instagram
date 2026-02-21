const jwt = require("jsonwebtoken");
const User = require("./user");

module.exports = async function (req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      req.flash("error", "Please login first");
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      req.flash("error", "Login again");
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch {
    req.flash("error", "Session expired. Login again.");
    return res.redirect("/login");
  }
};