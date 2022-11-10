"use strict";

const { Router } = require("express");

const router = Router();

//////
const { User, Driver, Order, Profile, sequelize } = require("../models");
const { baseParam } = require("../helper/util");
const { compareSync } = require("bcryptjs");
const { Op } = require("sequelize");

sequelize.sync({ alter: true })
  .then(() => {
    console.log("==================================");
    console.log("// Database synced successfully //");
    console.log("==================================");
  })
  .catch(err => console.error(err, "<<<<<< SYNC ERROR") );
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
    console.log(">>>>>> CORRECT PASSWORD <<<<<<<");
    req.session.userId = user.id;
    res.redirect("/");
  })
  .catch(err => {
    console.error(err);
    res.render("landing", baseParam({ errors: err }));
  });
});

router.post("/go/:id", (req, res) => {
  const { id } = req.params
  const { type, destination, pickupAt, DriverId  } = req.body
  req.session.order = Order.build({ type, destination, pickupAt, DriverId, UserId: id, satisfactionPoint: 0 });

  res.redirect("/ongoing");

  // res.send("DO SOME STUFF AND GO TO /ongoing");
});

router.get("/ongoing", (req, res) => {
  const { end } = req.query

  res.render('ongoing', { end })
})

router.post("/ongoing", (req, res) => {
  let { point } = req.body
  const { DriverId, UserId } = req.session.order;

  if (!point) point = 0;

  req.session.order.satisfactionPoint = point;

  req.session.order.save()
  .then(_ => {
    return Driver.increment({ totalPoint: 1 + point }, { where: { id: DriverId } })
  })
  .then(_ => {
    return User.increment({ totalPoint: 1 }, { where: { id: UserId } })
  })
  .then(_ => {
    res.redirect('/history')
  })
  .catch(err => {
    console.error(err);
    res.send(err)
  })
})

router.get('/history', (req, res) => {
  let { DriverId, UserId, point, search } = req.query
  let options = { include: { all: true }, where: { UserId } }

  if (point) options.where.satisfactionPoint = {[Op.eq]: point}
  if (DriverId) options.where.DriverId = DriverId
  if (search) {
    options.where.destination = { [Op.iLike]: `%${search}%` }
    options.where.pickupAt = { [Op.iLike]: `%${search}%` }
  }
  
  Order.findAll(options)
  .then(orders => {
    res.render('history', { orders, } )
  })
  .catch(err => {
    console.error(err);
    res.send(err)
  })
})

router.get("/settings/:userId", (req, res) => {});
router.get("/logout/:userId", (req, res) => {
  delete req.session.userId;
  res.redirect("/");
});

module.exports = router;
