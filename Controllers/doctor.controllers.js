require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Doctor = require("../Database/config").Doctor;
const bcryptjs = require("bcryptjs");
const findUserByEmail = require("../Database/config").findUserByEmail;
// Create and Save a new User
exports.registerDoctor = async (req, res) => {
  const { fullName, mobileNumber, email, doctor_id, password, validation } =
    req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hash = await bcryptjs.hash(password, 3);
    const doctor = {
      fullName,
      mobileNumber,
      email,
      doctor_id,
      doctor_certificate: req.fileUrl.doctor_certificate,
      doctor_photo: req.fileUrl.doctor_photo,
      password: hash,
      validation,
    };
    await Doctor.create(doctor);
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  let { fullName, mobileNumber, email, doctor_id, password, validation } =
    req.body;

  const d_photo = req.fileUrl.doctor_photo;
  const d_certificate = req.fileUrl.doctor_certificate;

  try {
    const existingDoctor = await Doctor.findByPk(req.params.id);
    if(email){ // if email is there in User or Pharmacist collection
      const existingUser = await findUserByEmail(email);
      if (existingUser && existingUser.id != req.params.id) {
        return res.status(409).json({ message: "User already exists with this email" });
      }
    }
    if (!existingDoctor) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password) {
      const hash = await bcryptjs.hash(password, 3);
      password = hash;
    }

    const new_doctor = {
      fullName: fullName || existingDoctor.fullName,
      mobileNumber: mobileNumber || existingDoctor.mobileNumber,
      email: email || existingDoctor.email,
      doctor_id: doctor_id || existingDoctor.doctor_id,
      password: password || existingDoctor.password,
      validation: validation || existingDoctor.validation,
      doctor_photo: d_photo || existingDoctor.doctor_photo,
      doctor_certificate: d_certificate || existingDoctor.doctor_certificate,
    };

    // Only delete the older file if a new file is uploaded and there's an existing file
    if (d_photo && existingDoctor.doctor_photo) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "doctor_photos",
        path.basename(existingDoctor.doctor_photo)
      );

      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }

    if (d_certificate && existingDoctor.doctor_certificate) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "doctor_certificates",
        path.basename(existingDoctor.doctor_certificate)
      );

      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }

    await Doctor.update(new_doctor, {
      where: { id: req.params.id },
    });

    return res.status(201).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const existingDoctor = await Doctor.findByPk(req.params.id);

    if (!existingDoctor) {
      return res.status(404).json({ message: "User not found" });
    }

    const d_photo = existingDoctor.doctor_photo;
    const d_certificate = existingDoctor.doctor_certificate;

    if (d_photo) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "doctor_photos",
        path.basename(d_photo)
      );

      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }

    if (d_certificate) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "doctor_certificates",
        path.basename(d_certificate)
      );

      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }

    await Doctor.destroy({
      where: { id: req.params.id },
    });

    return res.status(201).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
