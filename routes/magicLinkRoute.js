const router = require("express").Router();
const controller = require("../controller/userMagicLink");
const validator = require("../controller/validator")

router.post("/signupLink", validator.registerValidation, controller.register)
router.post("/linksend", validator.linkSendValidation, controller.loginLinkSend)
router.post("/links", validator.linkValidation, controller.loginWithLink)

module.exports = router;
