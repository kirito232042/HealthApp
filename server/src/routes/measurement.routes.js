const express = require("express");
const router = express.Router();
const measurementController = require("../controllers/measurement.controller");
const {
  createMeasurementRules,
  getByUserRules,
  paramIdRules,
  updateMeasurementRules
} = require("../middlewares/validators/measurement.validator");
const { validate } = require("../middlewares/validators/validator");

router.post("/", createMeasurementRules(), validate, measurementController.createMeasurement);

router.get("/all", getByUserRules(), validate, measurementController.getAllMeasurementsByUser);

router.delete("/:id", paramIdRules(), validate, measurementController.deleteMeasurement);

router.put("/:id", updateMeasurementRules(), validate, measurementController.updateMeasurement); // not used

module.exports = router;