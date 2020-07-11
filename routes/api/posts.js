const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

//@route    POST /api/posts
//@desc     Create a post
//@access   Private
router.post(
  "/",
  auth,
  [check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    console.log("heekfweeio");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findOne({ _id: req.user.id }).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      // const post = new Post(newPost);
      await newPost.save();
      return res.json(newPost);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

//@route    GET /api/posts
//@desc     Get all posts
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
});

//@route    GET /api/posts/:post_id
//@desc     Get post by id
//@access   Private
router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: "No post found" });
    }
    return res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No post found" });
    }

    return res.status(500).send("Server Error");
  }
});

//@route    DELETE /api/posts/:post_id
//@desc     Delete post by id
//@access   Private
router.delete("/:post_id", auth, async (req, res) => {
  try {
    // await Post.findByIdAndRemove(req.params.post_id);
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: "No post found " });
    }
    //check user
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not Authorized" });
    await post.remove();
    return res.json({ msg: "Post Deleted" });
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId")
      return res.status("404").json({ msg: "No post found" });
    return res.status(500).send("server error");
  }
});

//@route    PUT /api/posts/like/:id
//@desc     Like a post
//@access   Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "No post found " });
    }
    //check if post is already liked
    if (
      post.likes.filter((like) => {
        return like.user.toString() === req.user.id;
      }).length > 0
    ) {
      return res.status(400).json({ msg: "Post is already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No post found " });
    }
    return res.status(500).send("Server Error");
  }
});

//@route    PUT /api/posts/unlike/:id
//@desc     Unlike a post
//@access   Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "No post found " });
    }
    //check if post is not liked
    if (
      post.likes.filter((like) => {
        return like.user.toString() === req.user.id;
      }).length == 0
    ) {
      return res.status(400).json({ msg: "Post is not liked by the user" });
    }

    const removeIndex = post.likes
      .map((like) => like.user._id.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No post found " });
    }
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
