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

    resp.status(201).json({
      success: true,
      user,
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
      httponly: true,
    };

    resp.status(200).cookie("token", token, options).json({
      success: true,
      user,
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
