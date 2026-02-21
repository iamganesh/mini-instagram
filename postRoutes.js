const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Post = require("./Post");
const auth = require("./auth");

const router = express.Router();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => cb(null, (file.mimetype || "").startsWith("image/"))
});

router.get("/posts/new", auth, (req, res) => res.render("createPost"));

router.post("/posts", auth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.redirect("/posts/new");

  await Post.create({
    caption: req.body.caption || "",
    image: "/uploads/" + req.file.filename,
    user: req.user._id
  });

  res.redirect("/feed");
});

module.exports = router;