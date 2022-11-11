"use strict";

const db = require("./models");
const { readdirSync } = require("fs");

const migrates = readdirSync("./migrations");
const seeds = readdirSync("./seeders");

for (const migrate of migrates) {
  const func = require("./migrations/"+migrate.slice(0, -3));

  func.up(db.queryInterface, db.Sequelize);
  //console.log(func)
}

for (const seed of seeds) {
  const func = require("./seeders/"+seed.slice(0, -3));

  func.up(db.queryInterface, db.Sequelize);
  //console.log(func)
}
