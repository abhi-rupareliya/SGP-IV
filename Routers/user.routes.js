const express = require("express");
const fileUploaderMiddleware = require("../Middlewares/fileUploader");
const Router = express.Router();

const { user } = require("../Controllers");
Router.post("/", fileUploaderMiddleware("user_photo"), user.registerUser);
Router.put("/:id", fileUploaderMiddleware("user_photo"), user.updateUser);
Router.get("/", user.getAllUsers);
Router.get("/:id", user.getUserById);
Router.delete("/:id", user.deleteUser);
module.exports = Router;
