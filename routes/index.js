"use strict";

const { Router } = require("express");

const router = Router();

//////
const { User, Driver, Order, Profile } = require("../models");
const { baseParam } = require("../helper/util");

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
  res.render("signup");
});

router.post("/signup", (req, res) => {
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
});

router.get("/settings/:userId", (req, res) => {});
router.get("/logout/:userId", (req, res) => {});

module.exports = router;
