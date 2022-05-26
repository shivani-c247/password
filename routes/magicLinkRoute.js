const router = require("express").Router();
const controller = require("../controller/userMagicLink");

//router.post("/signupLink", controller.signUp)
//router.post("/linksend", controller.login)
router.post("/signUpLogin", controller.login);

module.exports = router;
