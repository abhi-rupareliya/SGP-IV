const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "user_photo":
        cb(null, path.resolve(__dirname, "..", "uploads", "user_photos"));
        break;
      case "doctor_photo":
        cb(null, path.resolve(__dirname, "..", "uploads", "doctor_photos"));
        break;
      case "doctor_certificate":
        cb(
          null,
          path.resolve(__dirname, "..", "uploads", "doctor_certificates")
        );
        break;
      case "pharmacist_photo":
        cb(null, path.resolve(__dirname, "..", "uploads", "pharmacist_photos"));
        break;
      case "pharmacist_certificate":
        cb(
          null,
          path.resolve(__dirname, "..", "uploads", "pharmacist_certificates")
        );
        break;
      case "pharmacy_photo":
        cb(null, path.resolve(__dirname, "..", "uploads", "pharmacy_photos"));
        break;
      case "pharmacy_certificate":
        cb(
          null,
          path.resolve(__dirname, "..", "uploads", "pharmacy_certificates")
        );
        break;
      case "post_image":
        cb(null, path.resolve(__dirname, "..", "uploads", "post_images"));
        break;
      default:
        break;
    }
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join("");
    const fileName = Date.now() + "-" + name;
    cb(null, fileName);
  },
});

function fileFilter(req, file, cb) {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const fileUploader = (...fileTypes) => {
  const fields = fileTypes.map((ft) => {
    return { name: ft, maxCount: 1 };
  });
  const upload = multer({
    storage,
    fileFilter,
  }).fields(fields);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      const fileUrl = {};
      for (ft of fileTypes) {
        if (req.files && req.files[ft]) {
          fileUrl[
            ft
          ] = `http://${process.env.HOST}:${process.env.PORT}/uploads/${ft}s/${req.files[ft][0].filename}`;
        }
      }
      req.fileUrl = fileUrl;
      next();
    });
  };
};
module.exports = fileUploader;
