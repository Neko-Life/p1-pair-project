"use strict";

const router = require("express").Router();
const Controller = require("../controllers")

router.get("/", Controller.showHome)
router.get("/signup", Controller.showSignUpForm)
router.post("/signup", Controller.addNewUser);
router.post("/login", Controller.userLogin);
router.post("/go", Controller.prepareOrder);
router.get("/ongoing", Controller.showOngoingOrder)
router.post("/ongoing", Controller.createNewOrder)
router.get('/history', Controller.showHistory)
router.get("/history/clear", Controller.clearHistory)
router.get("/settings", Controller.showSettings);
router.post("/settings", Controller.applySettings);
router.get("/logout", Controller.logOut);
router.get("/testingProfiles/:point", Controller.demo);
router.get("/delete-account", Controller.deleteAccount);

module.exports = router
