"use strict";

const { User, Driver, Order, Profile, sequelize } = require("../models");
const { baseParam } = require("../helper/util");
const { compareSync } = require("bcryptjs");
const { Op } = require("sequelize");
const invoicer = require('../helper/invoicer')
const { automailer, mailDetails } = require('../helper/automailer')

//////
//sequelize.sync({ alter: true })
//    .then(() => {
//        console.log("==================================");
//        console.log("// Database synced successfully //");
//        console.log("==================================");
//    })
//    .catch(err => console.error(err, "<<<<<< SYNC ERROR"));
//////

/**
 * @type {Map<number, Profile>}
 */
const profiles = new Map();

const getProfile = (req) => {
  return profiles.get(req.session.user?.id);
}

const setProfile = (req, profile) => {
  return profiles.set(req.session.user.id, profile);
}

const deleteProfile = (req) => {
  return profiles.delete(req.session.user.id);
}

const clearSession = (req) => {
  deleteProfile(req);
  delete req.session.user;
  delete req.session.order;
  return 0;
}

class Controller {
    static showHome(req, res) {
        if (req.session.order) {
            return res.redirect("/ongoing");
        }

        let { errors } = req.query

        if (req.session.user) {
	    console.log(req.session.user, "<<<<<<<<<<<<<< SESSION USER")
            Profile.findByPk(req.session.user.id)
                .then(profile => {
                    if (profile.totalPoint >= 100) {
                        return User.update({ role: 'Platinum' }, { where: { id: req.session.user.id } })
                    } else if (profile.totalPoint >= 50) {
                        return User.update({ role: 'Gold' }, { where: { id: req.session.user.id } })
                    } else if (profile.totalPoint >= 20) {
                        return User.update({ role: 'Silver' }, { where: { id: req.session.user.id } })
                    }
                })
                .then(_ => {
                    return Driver.findAll()
                })
                .then(drivers => {
                    console.log(req.session.user)
                    res.render("landing", baseParam({ user: req.session.user, drivers, errors, profile: getProfile(req) }));
                })
                .catch(err => {
                    console.error(err);
                    res.render("landing", baseParam({ errors: err }));
                });
        } else {
            res.render("landing", baseParam());
        }
    }

    static showSignUpForm(req, res) {
        if (req.session.order) return res.redirect("/ongoing");
        res.render("signup", baseParam());
    }

    static addNewUser(req, res) {
        // console.log(req.body);
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
    }

    static userLogin(req, res) {
        const { email, password } = req.body;

        User.findOne({
            where: {
                email: email
            },
            include: {
                model: Profile,
            }
        })
            .then(user => {
                console.log(user, "<<<<<<<<<< USER");
                if (!user || !compareSync(password, user.password)) {
                    return res.render("landing", baseParam({ errors: ["Invalid email or password"] }));
                }
                console.log(">>>>>> CORRECT PASSWORD <<<<<<<");

		profiles.set(user.id, user.Profile); 

		delete user.Profile;
                req.session.user = user;
                res.redirect("/");
            })
            .catch(err => {
                console.error(err);
                res.render("landing", baseParam({ errors: err }));
            });
    }

    static prepareOrder(req, res) {
        if (!req.session.user?.id) return res.redirect("/");
        const { type, destination, pickupAt, DriverId } = req.body

        if (!type || !destination || !pickupAt || !DriverId || destination.replace(/ /g, "").length == 0 || pickupAt.replace(/ /g, "").length == 0) {
            let eQuery = '';
            if (!type) eQuery += 'Type of Ride must be choosed,'
            else if (type !== "WalkBuroq" && type !== 'WalkRide' && type !== 'WalkCar' && type !== 'WalkTaxi') {
                eQuery += 'The inputed Order Type is not registered,'
            }

            if (!destination) eQuery += 'Destination must be filled,'
            else if (destination.replace(/ /g, "").length == 0) eQuery += 'Destination cannot be empty,'

            if (!pickupAt) eQuery += 'Pickup Point must be filled,'
            else if (pickupAt.replace(/ /g, "").length == 0) eQuery += 'Pickup Point cannot be empty,'

            if (!DriverId) eQuery += 'Driver must be choosed,'

            return res.redirect(`/?errors=${eQuery}`)
        }
        req.session.order = { type, destination, pickupAt, DriverId, UserId: req.session.user.id, satisfactionPoint: 0 };

        res.redirect("/ongoing");
    }

    static showOngoingOrder(req, res) {
        if (!req.session.user?.id) return res.redirect("/");
        let { end } = req.query

        if (req.session.order?.ETAStartDate) req.session.order.ETAStartDate = new Date(req.session.order.ETAStartDate);
        const lastEta = req.session.order.ETA ? req.session.order.ETA - ((new Date().getTime() - req.session.order.ETAStartDate.getTime()) / 1000) : -1;
        const ETA = req.session.order.ETA === undefined ? Math.floor(Math.random() * 30 * 60 + 600) : lastEta;

        if (ETA < 0) end = "end";
        if (!req.session.order.ETA) req.session.order.ETA = ETA;
        if (!req.session.order.ETAStartDate) req.session.order.ETAStartDate = new Date();

        console.log(req.session.order);

        res.render('ongoing', { end, ETA, user: req.session.user, profile: getProfile(req) });
    }

    static createNewOrder(req, res) {
        if (!req.session.user?.id) return res.redirect("/");
        let { point } = req.body
        const { DriverId, UserId } = req.session.order;

        if (!point) point = 0;

        req.session.order.satisfactionPoint = point;
        const theOrder = Order.build(req.session.order);
        theOrder.save()
            .then(_ => {
                return Driver.increment({ totalPoint: 1 + point }, { where: { id: DriverId } })
            })
            .then(_ => {
                return Profile.increment({ totalPoint: 9 }, { where: { UserId } })
            })
            .then(_ => {
                return Order.findOne({ order: [['id', 'DESC']], include: [User, Driver] });
            })
            // .then(order => {
            //     mailDetails.text = invoicer(order)
            //     mailDetails.to = order.User.email
            //     return automailer.sendMail(mailDetails)
            // })
            .then(info => {
                delete req.session.order;
                
		res.redirect(`/history?info=info`);
            })
            .catch(err => {
                console.error(err);
                res.send(err.message)
            })
    }

    static showHistory(req, res) {
        if (!req.session.user?.id) return res.redirect("/");
        if (req.session.order) return res.redirect("/ongoing");

        let { info, DriverId, point, search } = req.query
        let options = { include: Driver, where: { UserId: req.session.user.id } }

        if (point) options.where.satisfactionPoint = { [Op.eq]: point }
        if (DriverId) options.where.DriverId = DriverId
        if (search) {
            // options.where.destination = { [Op.iLike]: `%${search}%` }
            // options.where.pickupAt = { [Op.iLike]: `%${search}%` }
            options.where[Op.or] = [
                    { destination: { [Op.iLike]: `%${search}%` } },
                    { pickupAt: { [Op.iLike]: `%${search}%` } }
                ]
        }

        let drivers;

        Driver.findAll()
            .then(result => {
                drivers = result
                return Order.findAll(options)
            })
            .then(orders => {
                res.render('history', { orders, user: req.session.user, info, drivers, profile: getProfile(req)  })
            })
            .catch(err => {
                console.error(err);
                res.send(err.message)
            })
    }

    static clearHistory(req, res) {
        Order.destroy({ where: { UserId: req.session.user.id } })
            .then(_ => {
                res.redirect("/history")
            })
            .catch(err => {
                res.send(err)
            })
    }

    static showSettings(req, res) {
        if (!req.session.user?.id) return res.redirect("/");
        if (req.session.order) {
            return res.redirect("/ongoing");
        }

	const cachedProfile = getProfile(req);

        if (!cachedProfile) {
            Profile.findOne({ where: { UserId: req.session.user.id } })
                .then(profile => {
		    setProfile(req, profile);
                    res.render("settings", baseParam({ user: req.session.user, profile }));
                })
                .catch(err => {
                    console.error(err);
                    res.render("settings", baseParam({ errors: err }));
                });
        } else {
            res.render("settings", baseParam({ user: req.session.user, profile: cachedProfile }));
        }
    }

    static applySettings(req, res) {
        if (!req.session.user?.id) return res.redirect("/");
        console.log(req.body);
        if (req.body.password?.length && !User.validPassword(req.body)) {
            return res.render("settings", baseParam({ user: req.session.user, errors: ["Please fill the password correctly!"], profile: getProfile(req)  }));
        }

        const {
            profileName, bio, address, username, email, phoneNumber, password, oldPassword
        } = req.body;

        const userOptions = { username, email, };

        if (password?.length) {
            if (!oldPassword?.length || !compareSync(oldPassword, req.session.user.password)) {
                return res.render("settings", baseParam({ user: req.session.user, errors: ["Invalid old password!"], profile: getProfile(req)  }));
            }

            userOptions.password = password;
        }

        User.update(userOptions, { where: { id: req.session.user.id } })
            .then(() => Profile.update({ profileName, bio, address, phoneNumber }, { where: { id: req.session.user.id } }))
            .then(profile => {
		clearSession(req);
                res.redirect("/");
            })
            .catch(err => {
                console.error(err);

                // User.destroy({
                //   where: {
                //     email: email,
                //   }
                // }).catch(console.error);

                return res.render("settings", baseParam({ user: req.session.user, errors: err, profile: getProfile(req)  }));
            });
    }

    static logOut(req, res) {
        if (!req.session.user?.id) return res.redirect("/");
        if (req.session.order) {
            return res.redirect("/ongoing");
        }

	clearSession(req);

        res.redirect("/");
    }

    static demo(req, res) {
        let { point } = req.params
        let profiles;

        Profile.findByPk(req.session.user.id)
            .then(result => {
                profiles = result
                return Profile.increment({ totalPoint: point }, { where: { UserId: req.session.user.id } })
            })
            .then(_ => {
                res.redirect('/?done')
            })
            .catch(err => {
                console.log(err);
                res.send(err)
            })
    }

    static deleteAccount(req, res) {
      if (!req.session.user?.id) return res.redirect("/");

      Profile.destroy({ where: { UserId: req.session.user.id }})
      .then(() => {
	return User.destroy({
	  where: {
	    id: req.session.user.id,
	  }
	})
      })
      .then(_ => {
	  clearSession(req);
	  res.redirect('/')
      })
      .catch(err => {
	  console.log(err);
	  res.render("landing", baseParam({ errors: err }))
      })
    }
}

module.exports = Controller;
