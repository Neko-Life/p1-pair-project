"use strict";

const { Router } = require("express");

const router = Router();

//////
const { User, Driver, Order, Profile } = require("../models");
const { baseParam } = require("../helper/util");
const { compareSync } = require("bcryptjs");

/**
 * @type {Map<????, User>}
 */
const loggedIn = new Map();

//////

router.get("/", (req, res) => {
  if (req.smtsmt) {

  } else {
    res.render("landing" , baseParam());
  }
});

router.get("/reviews", (req, res) => {});
router.get("/signup", (req, res) => {
  res.render("signup", { errors: req.query.errors });
});

router.post("/signup", (req, res) => {
  if (!User.validPassword(req.body)) {
    return res.render("signup", { errors: ["Please fill the password correctly!"] });
  }
  const { username, email, phoneNumber, password } = req.body;

  User.create({ username, email, phoneNumber, password })
  .then(() => {
    res.redirect("/");
  })
  .catch(err => {
    console.error(err);
    return res.render("signup", baseParam({ errors: err }));
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({
    where: {
      email: email
    }
  })
  .then(user => {
    console.log(user, "<<<<<<<<<< USER");
    if (!user || !compareSync(password, user.password)) {
      return res.render("landing", baseParam({ errors: ["Invalid email or password"] }));
    }
    res.redirect("/");
  })
  .catch(err => {
    console.error(err);
    res.render("landing", baseParam({ errors: err }));
  });
});

router.get("/settings/:userId", (req, res) => {});
router.get("/logout/:userId", (req, res) => {});

module.exports = router;
