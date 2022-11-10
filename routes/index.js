"use strict";

const { Router } = require("express");
const invoicer = require('../helper/invoicer')
const { automailer, mailDetails } = require('../helper/automailer')
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
  if (req.session.order) {
    return res.redirect("/ongoing");
  }
  if (req.session.user) {
    Driver.findAll()
    .then(drivers => {
      console.log(req.session.user)
      res.render("landing", baseParam({ user: req.session.user, drivers }));
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
  if (req.session.order) {
    return res.redirect("/ongoing");
  }
  res.render("signup", baseParam());
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
    req.session.user = user;
    res.redirect("/");
  })
  .catch(err => {
    console.error(err);
    res.render("landing", baseParam({ errors: err }));
  });
});

router.post("/go", (req, res) => {
  if (!req.session.user?.id) return res.redirect("/");
  const { type, destination, pickupAt, DriverId  } = req.body
  req.session.order = Order.build({ type, destination, pickupAt, DriverId, UserId: req.session.user.id, satisfactionPoint: 0 });

  res.redirect("/ongoing");
});

router.get("/ongoing", (req, res) => {
  if (!req.session.user?.id) return res.redirect("/");
  let { end } = req.query
  if (req.session.order?.ETAStartDate) req.session.order.ETAStartDate = new Date(req.session.order.ETAStartDate);
  const lastEta = req.session.order.ETA ? req.session.order.ETA - ((new Date().getTime() - req.session.order.ETAStartDate.getTime()) / 1000) : -1;
  const ETA = req.session.order.ETA === undefined ? Math.floor(Math.random() * 30 * 60 + 600) : lastEta;
  if (ETA < 0) end = "end";
  if (!req.session.order.ETA) req.session.order.ETA = ETA;
  if (!req.session.order.ETAStartDate) req.session.order.ETAStartDate = new Date();
  console.log(req.session.order);

  res.render('ongoing', { end, ETA });
})

router.post("/ongoing", (req, res) => {
  if (!req.session.user?.id) return res.redirect("/");
  let { point } = req.body
  const { DriverId, UserId } = req.session.order;

  if (!point) point = 0;

  req.session.order.satisfactionPoint = point;
  req.session.order = Order.build(req.session.order);
  req.session.order.save()
  .then(_ => {
    return Driver.increment({ totalPoint: 1 + point }, { where: { id: DriverId } })
  })
  .then(_ => {
    return Profile.increment({ totalPoint: 1 }, { where: { UserId } })
  })
  .then(_ => {
    return Order.findOne({order: [[ 'id', 'DESC' ]], include: [User, Driver]});
  })
  .then(order => {
    mailDetails.text = invoicer(order)
    mailDetails.to = order.User.email
    return automailer.sendMail(mailDetails)
  })
  .then(info => {
    
    delete req.session.order;
    // res.send(req.session.user)
    res.redirect(`/history?info=info`);
  })
  .catch(err => {
    console.error(err);
    res.send(err)
  })
})

router.get('/history', (req, res) => {
  if (!req.session.user?.id) return res.redirect("/");
  if (req.session.order) return res.redirect("/ongoing");

  let { info, DriverId, point, search } = req.query
  let options = { include: Driver, where: { UserId: req.session.user.id } }

  if (point) options.where.satisfactionPoint = {[Op.eq]: point}
  if (DriverId) options.where.DriverId = DriverId
  if (search) {
    options.where.destination = { [Op.iLike]: `%${search}%` }
    options.where.pickupAt = { [Op.iLike]: `%${search}%` }
  }
  
  let drivers;

  Driver.findAll()
  .then(result => {
    drivers = result
    return Order.findAll(options)
  })
  .then(orders => {
    res.render('history', { orders, user: req.session.user, info, drivers } )
  })
  .catch(err => {
    console.error(err);
    res.send(err)
  })
})

router.get("/settings", (req, res) => {
  if (!req.session.user?.id) return res.redirect("/");
  if (req.session.order) {
    return res.redirect("/ongoing");
  }

  if (!req.session.user.profile) {
    Profile.findOne({ where: { UserId: req.session.user.id }})
    .then(profile => {
      req.session.user.profile = profile;
      res.render("settings", baseParam({ user: req.session.user }));
    })
    .catch(err => {
      console.error(err);
      res.render("settings", baseParam({ errors: err }));
    });
  } else {
      res.render("settings", baseParam({ user: req.session.user }));
  }
});

router.post("/settings", (req, res) => {
  if (!req.session.user?.id) return res.redirect("/");
  console.log(req.body);
  if (req.body.password?.length && !User.validPassword(req.body)) {
    return res.render("settings", baseParam({ user: req.session.user, errors: ["Please fill the password correctly!"] }));
  }

  const {
    profileName, bio, address, username, email, phoneNumber, password, oldPassword
  } = req.body;

  const userOptions = { username, email, };

  if (password?.length) {
    if (!oldPassword?.length || !compareSync(oldPassword, req.session.user.password)) {
      return res.render("settings", baseParam({ user: req.session.user, errors: ["Invalid old password!"] }));
    }

    userOptions.password = password;
  }

  let tempNewUser;
  User.update(userOptions, { where: { id: req.session.user.id } })
  .then(user => {
    tempNewUser = user;
    return Profile.update({ profileName, bio, address, phoneNumber }, { where: { id: req.session.user.id } });
  })
  .then(profile => {
    tempNewUser.profile = profile;
    // req.session.user = tempNewUser;
    res.redirect("/");
  })
  .catch(err => {
    console.error(err);
    
    // User.destroy({
    //   where: {
    //     email: email,
    //   }
    // }).catch(console.error);

    return res.render("settings", baseParam({ user: req.session.user, errors: err }));
  });
});

router.get("/logout", (req, res) => {
  if (!req.session.user?.id) return res.redirect("/");
  if (req.session.order) {
    return res.redirect("/ongoing");
  }
  delete req.session.user;
  res.redirect("/");
});

module.exports = router
