const express = require("express");
const {
  userController,
  addUser,
  removeUser,
} = require("../controllers/userController");
const decorateHtmlRes = require("../middlewares/common/common/decorateHtmlRes");
const avatarUpload = require("../middlewares/users/avatarUpload");
const {
  addUserValidator,
  addUserValidationHandler,
} = require("../middlewares/users/userValidator");
const router = express.Router();

router.get("/", decorateHtmlRes(`Users`), userController);
router.post(
  "/",
  avatarUpload,
  addUserValidator,
  addUserValidationHandler,
  addUser
);

router.delete(`/:id`, removeUser);
module.exports = router;
