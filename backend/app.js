const express = require("express");
const app = express();

if (process.env.NODE_ENV != "production") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

//using middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}));

//importing routes
const post=require("./routes/post");
const user=require("./routes/user");

//using routes
//(localhost:4000/api/v1/posts/upload)
app.use("/api/v1", post);
//(localhost:4000/api/v1/register)//for registration
app.use("/api/v1", user);

module.exports = app;
