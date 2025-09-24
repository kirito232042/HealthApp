const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerRules, loginRules } = require('../middlewares/validators/auth.validator');
const { validate } = require('../middlewares/validators/validator');

router.post('/register', registerRules(), validate, authController.register);
router.post('/login', loginRules(), validate, authController.login);

module.exports = router;