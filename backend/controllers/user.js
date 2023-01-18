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
        success:true,user
    })

  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
