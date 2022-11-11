"use strict";

const { Router } = require("express");

const router = Router();

//////
const { User, Driver, Order, Profile, sequelize } = require("../models");
const { baseParam } = require("../helper/util");
const { compareSync } = require("bcryptjs");
const { Op } = require("sequelize");
const invoicer = require('../helper/invoicer')
const { automailer, mailDetails } = require('../helper/automailer')
const Controller = require("../controllers")
sequelize.sync({ alter: true })
  .then(() => {
    console.log("==================================");
    console.log("// Database synced successfully //");
    console.log("==================================");
  })
  .catch(err => console.error(err, "<<<<<< SYNC ERROR") );
//////

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

router.get("/logout", (req, res) => {
  if (!req.session.user?.id) return res.redirect("/");
  if (req.session.order) {
    return res.redirect("/ongoing");
  }
  delete req.session.user;
  res.redirect("/");
});

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
