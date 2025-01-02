const express = require("express");
const { auth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const staffValidation = require("../../validations/staff.validation");
const staffController = require("../../controllers/staff.controller");

const router = express.Router();

router
  .route("/")
  .post(
    auth(),
    validate(staffValidation.createStaff),
    staffController.createStaff
  )
  .get(auth(), staffController.getStaffs);

router
  .route("/:staffId")
  .get(auth(), validate(staffValidation.getStaff), staffController.getStaff)
  .put(
    auth(),
    validate(staffValidation.updateStaff),
    staffController.updateStaff
  )
  .delete(
    auth(),
    validate(staffValidation.deleteStaff),
    staffController.deleteStaff
  );

module.exports = router;
