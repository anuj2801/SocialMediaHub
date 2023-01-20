const user = require("../models/user");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, resp, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return resp.status(401).json({
        message: "Please Login First",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await user.findById(decoded._id);

    next();
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
};
