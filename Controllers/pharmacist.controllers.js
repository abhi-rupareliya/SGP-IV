require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Pharmacist = require("../Database/config").Pharmacist;
const bcryptjs = require("bcryptjs");
const findUserByEmail = require("../Database/config").findUserByEmail;
// Create and Save a new User
exports.registerPharmacist = async (req, res) => {
  const {
    fullName,
    mobileNumber,
    email,
    pharmacist_liscence,
    password,
    validation,
  } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hash = await bcryptjs.hash(password, 3);
    const pharmacist = {
      fullName,
      mobileNumber,
      email,
      pharmacist_liscence,
      pharmacist_certificate: req.fileUrl.pharmacist_certificate,
      pharmacist_photo: req.fileUrl.pharmacist_photo,
      password: hash,
      validation,
    };
    await Pharmacist.create(pharmacist);
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.updatePharmacist = async (req, res) => {
  let {
    fullName,
    mobileNumber,
    email,
    pharmacist_liscence,
    password,
    validation,
  } = req.body;
  const p_photo = req.fileUrl.pharmacist_photo;
  const p_certificate = req.fileUrl.pharmacist_certificate;
  try {
    const existing = await Pharmacist.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }
    if (email) {
      // if email is there in User or Doctor table
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
    const new_pharmacist = {
      fullName: fullName || existing.fullName,
      mobileNumber: mobileNumber || existing.mobileNumber,
      email: email || existing.email,
      pharmacist_liscence: pharmacist_liscence || existing.pharmacist_liscence,
      password: password || existing.password,
      validation: validation || existing.validation,
      pharmacist_photo: p_photo || existing.pharmacist_photo,
      pharmacist_certificate: p_certificate || existing.pharmacist_certificate,
    };

    // Only delete the older file if a new file is uploaded and there's an existing file
    if (p_photo && existing.pharmacist_photo) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "pharmacist_photos",
        path.basename(existing.pharmacist_photo)
      );
      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }
    if (p_certificate && existing.pharmacist_certificate) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "pharmacist_certificates",
        path.basename(existing.pharmacist_certificate)
      );
      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }
    await Pharmacist.update(new_pharmacist, {
      where: { id: req.params.id },
    });
    return res.status(201).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.deletePharmacist = async (req, res) => {
  try {
    console.warn(req.params.id);
    const existing = await Pharmacist.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }
    const p_photo = existing.pharmacist_photo;
    const p_certificate = existing.pharmacist_certificate;
    if (p_photo) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "pharmacist_photos",
        path.basename(p_photo)
      );
      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }
    if (p_certificate) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "pharmacist_certificates",
        path.basename(p_certificate)
      );
      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }
    await Pharmacist.destroy({
      where: { id: req.params.id },
    });
    return res.status(201).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPharmacist = async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findByPk(req.params.id);
    if (!pharmacist) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(pharmacist);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllPharmacist = async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findAll();
    return res.status(200).json(pharmacist);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
