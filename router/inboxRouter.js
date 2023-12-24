const express = require("express");
const inboxController = require("../controllers/inboxController");
const decorateHtmlRes = require("../middlewares/common/common/decorateHtmlRes");
const router = express.Router();

router.get("/", decorateHtmlRes(`Inbox`), inboxController);

module.exports = router;
