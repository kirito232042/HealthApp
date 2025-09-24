const express = require("express");
const router = express.Router();
const userinfoController = require("../controllers/userinfor.controller");
const { 
  userIdParamRule, 
  createProfileRules, 
  updateProfileRules 
} = require("../middlewares/validators/profile.validator");
const { validate } = require("../middlewares/validators/validator");

router.get("/:userId", userIdParamRule(), validate, userinfoController.getUserInfo);

router.post("/:userId", updateProfileRules(), validate, userinfoController.updateUserInfo);

router.post("/:userId/new", createProfileRules(), validate, userinfoController.createNewProfile);

module.exports = router;