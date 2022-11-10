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
router.get("/signup", (req, res) => {});
router.get("/login", (req, res) => {});
router.get("/settings/:userId", (req, res) => {});
router.get("/logut/:userId", (req, res) => {});

module.exports = router;
