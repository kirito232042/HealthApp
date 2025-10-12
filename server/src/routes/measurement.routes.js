const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurement.controller');
// const authMiddleware = require('../middlewares/auth.middleware'); // Nên có middleware để bảo vệ route

// CRUD Routes
router.post('/', measurementController.createMeasurement);
router.get('/user/:userId', measurementController.getAllMeasurementsByUser);
router.put('/:id', measurementController.updateMeasurement);
router.delete('/:id', measurementController.deleteMeasurement);

// Advanced Query Routes
router.get('/latest-daily', measurementController.getLatestDailyMeasurements);
router.get('/latest-by-date', measurementController.getLatestForUserByDate); 
router.get('/latest-in-range', measurementController.getLatestForUserInDateRange);

module.exports = router;