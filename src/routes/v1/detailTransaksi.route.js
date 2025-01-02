const express = require("express");
const { auth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const detailTransaksiValidation = require("../../validations/detailTransaksi.validation");
const detailTransaksiController = require("../../controllers/detailTransaksi.controller");

const router = express.Router();

router
  .route("/")
  .post(
    auth(),
    validate(detailTransaksiValidation.createDetailTransaksi),
    detailTransaksiController.createDetailTransaksi
  )
  .get(auth(), detailTransaksiController.getDetailTransaksis);

router
  .route("/:detailTransaksiId")
  .get(
    auth(),
    validate(detailTransaksiValidation.getDetailTransaksi),
    detailTransaksiController.getDetailTransaksi
  )
  .put(
    auth(),
    validate(detailTransaksiValidation.updateDetailTransaksi),
    detailTransaksiController.updateDetailTransaksi
  )
  .delete(
    auth(),
    validate(detailTransaksiValidation.deleteDetailTransaksi),
    detailTransaksiController.deleteDetailTransaksi
  );

module.exports = router;
