require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./db");
const authRoutes = require("./authRoutes");
const postRoutes = require("./postRoutes");
const feedRoutes = require("./feedRoutes");
const auth = require("./auth");

const app = express();
app.use("/static", express.static(__dirname));

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "session_secret_123",
    resave: false,
    saveUninitialized: false
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.set("views", __dirname);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.redirect("/login"));
app.get("/dashboard", auth, (req, res) => res.render("dashboard", { me: req.user }));

app.use(authRoutes);
app.use(postRoutes);
app.use(feedRoutes);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log("Server running on port " + PORT));