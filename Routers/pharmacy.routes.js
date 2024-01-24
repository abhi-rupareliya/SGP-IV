const express = require("express");
const fileUploaderMiddleware = require("../Middlewares/fileUploader");
const Router = express.Router();

const {pharmacy} = require("../Controllers");
Router.post("/", fileUploaderMiddleware("pharmacy_certificate", "pharmacy_photo"), pharmacy.createPharmacy);
Router.put('/:id', fileUploaderMiddleware("pharmacy_certificate", "pharmacy_photo"), pharmacy.updatePharmacy);
Router.get('/', pharmacy.getAllPharmacies);
Router.get('/:id', pharmacy.getPharmacy);
Router.delete('/:id', pharmacy.deletePharmacy);
module.exports = Router;