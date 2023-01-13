const post=require("../models/post")

exports.createPost=async (req, resp)=>{
    try{
          const newPostData={
            caption: req.body.caption,
            image:{
                public_id:"req.body.public_id",
                url:"req.body.url",
            },
            owner:req.user._id,
          };

          const newPost=await post.create(newPostData);
          
          resp.status(201).json({
            success:true,
            post:newPost,
          });
          
    }
    catch(error){
        resp.status(500).json({
            success:false,
            message:error.message,
        });
    }
};