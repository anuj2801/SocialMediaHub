const user = require("../models/user");
const User = require("../models/user");

exports.register = async (req, resp) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return resp.status(400).json({
        success: false,
        message: "user already exists",
      });
    }
    await User.create({
      name,
      email,
      password,
      avatar: { public_id: "sample id", url: "sample" },
    });

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    resp.status(201).cookie("token", token, options).json({
      success: true,
      message: "user registered successfully",
      user,
      token,
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return resp.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return resp.status(400).json({
        success: false,
        message: "Password Incorrect",
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    resp.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, resp) => {
  try {
    resp
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged Out",
      });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.followandUnfollowUser = async (req, resp) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return resp.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
      loggedInUser.following.splice(indexfollowing, 1);

      const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);
      userToFollow.followers.splice(indexfollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();

      resp.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      resp.status(200).json({
        success: true,
        message: "User Followed",
      });
    }
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, resp) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { oldPassword, NewPassword } = req.body;

    if (!oldPassword) {
      return resp.status(500).json({
        success: false,
        message: "Please enter Old Password",
      });
    }

    if (!NewPassword) {
      return resp.status(500).json({
        success: false,
        message: "Please enter New Password",
      });
    }

    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      return resp.status(400).json({
        success: false,
        message: "Incorrect Old Password",
      });
    }

    user.password = NewPassword;

    await user.save();

    resp.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, resp) => {
  try {
    const user = await User.findById(req.user._id);

    const { name, email } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    resp.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};
