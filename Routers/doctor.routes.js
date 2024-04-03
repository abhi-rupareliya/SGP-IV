const express = require("express");
const fileUploaderMiddleware = require("../Middlewares/fileUploader");
const Router = express.Router();

const {doctor} = require("../Controllers");
Router.post("/", fileUploaderMiddleware("doctor_certificate", "doctor_photo"), doctor.registerDoctor);
Router.put('/:id', fileUploaderMiddleware("doctor_certificate", "doctor_photo"), doctor.updateDoctor);
Router.get('/', doctor.getAllDoctors);
Router.get('/:id', doctor.getDoctor);
Router.delete('/:id', doctor.deleteDoctor);
module.exports = Router;