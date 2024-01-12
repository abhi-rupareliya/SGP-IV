const express = require("express");
const Router = express.Router();

const { auth } = require("../Controllers");
Router.post("/login", auth.login);
module.exports = Router;
