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
  if (req.session.userId) {
    let foundUser;
    User.findByPk(req.session.userId)
    .then(user => {
      if (!user) {
	delete req.session.userId;
	return res.render("landing", baseParam({ errors: ["Invalid session, please retry login"] }));
      }
      foundUser = user;
      return Driver.findAll();
    })
    .then(drivers => {
      res.render("landing", baseParam({ user: foundUser, drivers }));
    })
    .catch(err => {
      console.error(err);
      res.render("landing", baseParam({ errors: err }));
    });
  } else {
    res.render("landing" , baseParam());
  }
});

router.get("/reviews", (req, res) => {});
router.get("/signup", (req, res) => {
  res.render("signup", { errors: req.query.errors });
});

router.post("/signup", (req, res) => {
  console.log(req.body);
  if (!User.validPassword(req.body)) {
    return res.render("signup", { errors: ["Please fill the password correctly!"] });
  }
  const { username, email, phoneNumber, password } = req.body;

  User.create({ username, email, password })
  .then(() => User.findOne({ where: { email: email } }))
  .then(user => Profile.create({ phoneNumber, UserId: user.id }))
  .then(() => {
    res.redirect("/");
  })
  .catch(err => {
    console.error(err);
    
    User.destroy({
      where: {
	email: email,
      }
    }).catch(console.error);

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
    console.log(">>>>>> CORRECT PASSWORD 	<<<<<<<");
    req.session.userId = user.id;
    res.redirect("/");
  })
  .catch(err => {
    console.error(err);
    res.render("landing", baseParam({ errors: err }));
  });
});

router.post("/go/:id", (req, res) => {
  res.send("DO SOME STUFF AND GO TO /ongoing");
});

router.get("/ongoing", (req, res) => {
  let { end } = req.query

  res.render('ongoing', { end })
})

router.get("/settings/:userId", (req, res) => {});
router.get("/logout/:userId", (req, res) => {
  delete req.session.userId;
  res.redirect("/");
});

module.exports = router;
