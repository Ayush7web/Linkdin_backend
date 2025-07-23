const postModel = require("../models/post");
const { post } = require("../routes/post");

exports.addPost = async (req, res) => {
  try {
    const { desc, imageLink } = req.body;
    let userId = req.user._id;

    const addPost = new postModel({ user: userId, desc, imageLink });

    if (!addPost) {
      res.status(400).json({ error: "something went wrong" });
    }
    await addPost.save();
    return res
      .status(200)
      .json({ message: "post successfully", post: addPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

// ==================================================================================================

exports.likeDislikePost = async (req, res) => {
  try {
    let selfId = req.user._id;
    let { postId } = req.body;
    let post = await postModel.findById(postId);

    if (!post) {
      return res.status(400).json({ error: "post such not found" });
    }
    const index = post.likes.findIndex((id) => id.equals(selfId));

    if (index !== -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(selfId);
    }

    await post.save();
    return res.status(200).json({
      message: index !== -1 ? "post unliked" : "post liked",
      likes: post.likes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

exports.getAllPost = async (req, res) => {
  try {
    let posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .populate("user", "-password");
    res.status(200).json({ message: "fetched data", posts: posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

exports.getPostByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId).populate("user", "-password");

    if (!post) {
      return res.status(400).json({ error: "no such post be found" });
    }
    return res.status(200).json({ message: "post be found", post: post });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

// ======================================================================================================

exports.getTop5PostForUser = async (req, res) => {
  try {
    const { postId } = req.params;
    const posts = await postModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .limit(5);
    return res.status(200).json({ message: "data fetched", posts: posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};


// ============================================================================================================

exports.getAllPostForUser = async(req , res) => {
  try {
        const { postId } = req.params;
        const posts = await postModel
          .find({ user: userId })
          .sort({ createdAt: -1 })
          .populate("user", "-password")
        return res.status(200).json({ message: "data fetched", posts: posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
}