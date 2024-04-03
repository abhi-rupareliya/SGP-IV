const express = require("express");
const fileUploaderMiddleware = require("../Middlewares/fileUploader");
const {authenticateUser} = require("../Middlewares/auth.middleware");
const Router = express.Router();

const { post } = require("../Controllers");
Router.post("/",authenticateUser, fileUploaderMiddleware("post_image"), post.createPost);
Router.put("/:id",authenticateUser, fileUploaderMiddleware("post_image"), post.updatePost);
Router.delete("/:id",authenticateUser, post.deletePost);
Router.get("/", post.getAllPosts);
Router.get("/:id", post.getPostById);
module.exports = Router;