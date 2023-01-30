const mongoose = require("mongoose");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  avatar: {
    public_id: String,
    url: String,
  },

  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "Email already exists"],
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least of 6 characters"],
    select: false,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  resetPasswordToken: { type: String, default: "abcd" },
  resetPasswordTokenExpire: { type: Date, default: Date.now() },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrpyt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrpyt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedtoken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await this.updateOne({ $set: { resetPasswordToken: hashedtoken } });
  await this.updateOne({
    $set: { resetPasswordTokenExpire: Date.now() + 10 * 60 * 1000 },
  });

  return resetToken;
};

module.exports = mongoose.model("user", userSchema);
