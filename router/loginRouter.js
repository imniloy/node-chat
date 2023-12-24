const express = require("express");
const loginController = require("../controllers/loginController");
const decorateHtmlRes = require("../middlewares/common/common/decorateHtmlRes");
const router = express.Router();

router.get("/", decorateHtmlRes(`Login`), loginController);

module.exports = router;
