require("dotenv").config();
const fs = require("fs");
const path = require("path");
const User = require("../Database/config").User;
const bcryptjs = require("bcryptjs");
const findUserByEmail = require("../Database/config").findUserByEmail;
// Create and Save a new User
exports.registerUser = async (req, res) => {
  const {
    fullName,
    mobileNumber,
    email,
    medical_student,
    medical_student_id,
    password,
    validation,
  } = req.body;
  try {
    const hash = await bcryptjs.hash(password, 3);
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    await User.create({
      fullName,
      mobileNumber,
      email,
      medical_student,
      medical_student_id,
      password: hash,
      validation,
      user_photo: req.fileUrl.user_photo,
    });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.errors || error.message });
  }
};

// update user
exports.updateUser = async (req, res) => {
  let {
    fullName,
    mobileNumber,
    email,
    medical_student,
    medical_student_id,
    password,
    validation,
  } = req.body;
  const newFileUrl = req.fileUrl.user_photo;
  try {
    const existingUser = await User.findByPk(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (email) {
      // if email is there in Doctor or Pharmacist collection
      const existingUser = await findUserByEmail(email);
      if (existingUser && existingUser.id != req.params.id) {
        return res
          .status(409)
          .json({ message: "User already exists with this email" });
      }
    }
    if (password) {
      const hash = await bcryptjs.hash(password, 3);
      password = hash;
    }
    const oldFileUrl = existingUser.user_photo;

    const userToUpdate = {
      fullName: fullName || existingUser.fullName,
      mobileNumber: mobileNumber || existingUser.mobileNumber,
      email: email || existingUser.email,
      medical_student: medical_student || existingUser.medical_student,
      medical_student_id: medical_student_id || existingUser.medical_student_id,
      password: password || existingUser.password,
      validation: validation || existingUser.validation,
      user_photo: newFileUrl || oldFileUrl,
    };

    // Only delete the older file if a new file is uploaded and there's an existing file
    if (newFileUrl && oldFileUrl) {
      const oldFilePath = path.resolve(
        __dirname,
        "..",
        "uploads",
        "user_photos",
        path.basename(oldFileUrl)
      );

      fs.unlink(oldFilePath, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }
    await User.update(userToUpdate, {
      where: { id: req.params.id },
    });
    return res.status(201).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const existingUser = await User.findByPk(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const fileurl = existingUser.user_photo;

    if (fileurl) {
      const oldFilePath = path.resolve(
        __dirname,
        "..",
        "uploads",
        "user_photos",
        path.basename(fileurl)
      );

      fs.unlink(oldFilePath, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }
    await User.destroy({ where: { id: req.params.id } });
    return res.status(201).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
