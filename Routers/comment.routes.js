const express = require("express");
const { authenticateUser } = require("../Middlewares/auth.middleware");
const Router = express.Router();

const { comment } = require("../Controllers");

Router.post("/", authenticateUser, comment.createComment);
Router.delete("/:id", authenticateUser, comment.deleteComment);
Router.get("/:pid", comment.getComments);
module.exports = Router;
