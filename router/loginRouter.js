const express = require("express");
const { getLogin, login, logout } = require("../controllers/loginController");
const decorateHtmlRes = require("../middlewares/common/common/decorateHtmlRes");
const router = express.Router();

router.get("/", decorateHtmlRes(`Login`), getLogin);
router.post("/", doLoginValidators, doLoginValidationHandler, login);

router.delete("/", logout);

module.exports = router;
