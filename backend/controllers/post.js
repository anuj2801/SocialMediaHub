const Post = require("../models/post");
const User = require("../models/user");

exports.createPost = async (req, resp) => {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "req.body.public_id",
        url: "req.body.url",
      },
      owner: req.user._id,
    };

    const newpost = await Post.create(newPostData);

    const user = await User.findById(req.user._id);
    user.posts.push(newpost._id);

    await user.save();
    resp.status(201).json({
      success: true,
      newpost,
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePost = async (req, resp) => {
  try {
    const detectpost = await Post.findById(req.params.id);
    if (!detectpost) {
      resp.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }

    if (detectpost.owner.toString() !== req.user._id.toString()) {
      resp.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await Post.remove();

    const user = await User.findById(req.user._id);
    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);

    await user.save();

    resp.status(200).json({
      success: true,
      message: "Post Deleted",
    });
  } catch (error) {
    resp.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

exports.likeAndUnlikePost = async (req, resp) => {
  try {
    const detectpost = await Post.findById(req.params.id);

    if (!detectpost) {
      resp.status(404).json({
        success: false,
        message: "Post Nor Found",
      });
    }

    if (detectpost.likes.includes(req.user._id)) {
      const index = detectpost.likes.indexOf(req.user._id);
      detectpost.likes.splice(index, 1);
      await detectpost.save();

      return resp.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {
      detectpost.likes.push(req.user._id);
      await detectpost.save();

      return resp.status(200).json({
        success: true,
        message: "Post liked",
      });
    }
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPostofFollowing = async (req, resp) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
    });

    resp.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCaption = async (req, resp) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      resp.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    } else {
      if (post.owner.toString() !== req.user._id.toString()) {
        resp.status(401).json({
          success: false,
          message: "Unauthorized",
        });

        post.caption = req.body.caption;

        await post.save();

        resp.status(200).json({
          success: true,
          message: "Caption Updated",
        });
      }
    }
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.commentOnPost = async (req, resp) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return resp.status(404).json({
        success: false,
        message: "Post Not found",
      });
    }

    //finding comment index
    let commentIndex = -1;
    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = index;
      }
    });

    //if comment is present, then updating
    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = req.body.comment;
      await post.save();
      resp.status(200).json({
        success: true,
        message: "Comment updated",
      });
    }
    //else adding comment
    else {
      post.comments.push({ user: req.user._id, comment: req.body.comment });
      await post.save();
      resp.status(200).json({
        success: true,
        message: "Comment added",
      });
    }
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
