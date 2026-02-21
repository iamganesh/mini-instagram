const express = require("express");
const Post = require("./Post");
const auth = require("./auth");

const router = express.Router();

router.get("/feed", auth, async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = 4;

  const sortParam = req.query.sort === "oldest" ? "oldest" : "newest";
  const sort = sortParam === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const total = await Post.countDocuments();
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const posts = await Post.find()
    .populate("user", "name")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  res.render("feed", { posts, page, totalPages, sortParam, me: req.user });
});

module.exports = router;