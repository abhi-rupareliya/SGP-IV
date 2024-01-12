const express = require("express");
const fileUploaderMiddleware = require("../Middlewares/fileUploader");
const Router = express.Router();

const {pharmacist} = require("../Controllers");
Router.post("/", fileUploaderMiddleware("pharmacist_certificate", "pharmacist_photo"), pharmacist.registerPharmacist);
Router.put('/:id', fileUploaderMiddleware("pharmacist_certificate", "pharmacist_photo"), pharmacist.updatePharmacist);
Router.get('/', pharmacist.getAllPharmacist);
Router.get('/:id', pharmacist.getPharmacist);
Router.delete('/:id', pharmacist.deletePharmacist);
module.exports = Router;