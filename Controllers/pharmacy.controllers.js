const db = require("../Database/config");
const Pharmacy = db.Pharmacy;
const Pharmacist = db.Pharmacist;
const path = require("path");
const fs = require("fs");
const findUserByEmail = db.findUserByEmail;
exports.createPharmacy = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      email,
      pharmacy_no,
      pharmacist_id,
      address,
      city,
      state,
    } = req.body;
    const pharmacy = await Pharmacy.create({
      fullName,
      mobileNumber,
      email,
      pharmacy_no,
      pharmacist_id,
      pharmacy_certificate: req.fileUrl.pharmacy_certificate,
      pharmacy_photo: req.fileUrl.pharmacy_photo,
      address,
      city,
      state,
    });
    return res
      .status(201)
      .json({ message: "Pharmacy created successfully", pharmacy });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.updatePharmacy = async (req, res) => {
  try {
    const pharmacy_certificate = req.fileUrl.pharmacy_certificate;
    const pharmacy_photo = req.fileUrl.pharmacy_photo;
    const existing = await Pharmacy.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    if (req.body.email) {
      // if email is there in User or Doctor or pharmacist table
      const existingUser = await findUserByEmail(req.body.email);
      if (existingUser && existingUser.id != req.params.id) {
        return res
          .status(409)
          .json({ message: "User already exists with this email" });
      }
    }
    if (pharmacy_certificate && existing.pharmacy_certificate) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "pharmacy_certificates",
        path.basename(existing.pharmacy_certificate)
      );
      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }

    if (pharmacy_photo && existing.pharmacy_photo) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "pharmacy_photos",
        path.basename(existing.pharmacy_photo)
      );
      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }
    await existing.update({
      fullName: req.body.fullName || existing.fullName,
      mobileNumber: req.body.mobileNumber || existing.mobileNumber,
      email: req.body.email || existing.email,
      pharmacy_no: req.body.pharmacy_no || existing.pharmacy_no,
      pharmacist_id: req.body.pharmacist_id || existing.pharmacist_id,
      pharmacy_certificate:
        pharmacy_certificate || existing.pharmacy_certificate,
      pharmacy_photo: pharmacy_photo || existing.pharmacy_photo,
      validation: req.body.validation || existing.validation,
      address: req.body.address || existing.address,
      city: req.body.city || existing.city,
      state: req.body.state || existing.state,
    });
    return res.status(200).json({ message: "Pharmacy updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.deletePharmacy = async (req, res) => {
  try {
    const existing = await Pharmacy.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    await existing.destroy();
    return res.status(200).json({ message: "Pharmacy deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.getPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByPk(req.params.id, {
      include: {
        model: Pharmacist,
        // attributes: ["fullName"],
        attributes: { exclude: ["password", "validation"] },
      },
    });
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    return res.status(200).json(pharmacy);
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.findAll({
      include: {
        model: Pharmacist,
        // attributes: ["fullName"],
        attributes: { exclude: ["password", "validation"] },
      },
    });
    if (!pharmacies) {
      return res.status(404).json({ message: "Pharmacies not found" });
    }
    return res.status(200).json(pharmacies);
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};
