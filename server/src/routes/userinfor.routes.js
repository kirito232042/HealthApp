const express = require("express");
const router = express.Router();
const userinfoController = require("../controllers/userinfor.controller");
const { 
  userIdParamRule,  
  updateProfileRules 
} = require("../middlewares/validators/profile.validator");
const { validate } = require("../middlewares/validators/validator");

router.get("/:userId", userIdParamRule(), userinfoController.getUserInfo);

router.post("/:userId", updateProfileRules(), userinfoController.updateUserInfo);

// router.post("/:userId/new", createProfileRules(), validate, userinfoController.createNewProfile);

module.exports = router;