"use strict";

const { Router } = require("express");

const router = Router();

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
///testing
router.get("/testingProfiles/:point", (req, res) => {
  let { point } = req.params
  let profiles;
  
  Profile.findByPk(req.session.user.id)
  .then( result => {
    profiles = result
    return Profile.increment({totalPoint:point}, {where: {UserId:req.session.user.id}})
  })
  .then(_ => {
    res.redirect('/?done')
  })
  .catch(err => {
    console.log(err);
    res.send(err)
  })
})

module.exports = router