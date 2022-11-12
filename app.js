"use strict";

require('dotenv').config();

/**
 * ENV VARS RULES
 * DATABASE_URL OPTIONAL (use config/config.json instead)
 * NODE_ENV OPTIONAL (default development)
 * COOKIE_SECURE OPTIONAL (default false)
 * PORT OPTIONAL (use config/config.json instead, fallback 3000)
 * PGPORT OPTIONAL (use config/config.json instead, fallback 5432)
 * SESSION_SECRET REQUIRED
 */
const requiredEnvVars = ["SESSION_SECRET"];
for (const key of requiredEnvVars) {
  if ([null, undefined, ""].includes(process.env[key])) {
    throw new TypeError(`ENV VARIABLE ${key} must exist!`);
  }
}
 
const express = require("express");
const session = require("express-session");
const { Pool } = require("pg");
const { readdirSync } = require("fs");

const router = require("./routes");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

let configExist, config;

try {
  configExist = readdirSync("./config").includes("config.json");
}
catch (err) {
  console.log(err);
}

if (configExist) {
  config = require("./config/config.json")[process.env.NODE_ENV || "development"];
  console.log("Using config:", config);
}

const PORT = process.env.PORT || config?.expressPort || 3000;
const DB_PORT = process.env.PGPORT || config?.port || 5432;
const storeOptions = {
  createTableIfMissing: true,
};

if (process.env.DATABASE_URL?.length) {
  storeOptions.conString = process.env.DATABASE_URL;
  storeOptions.conObject = {
      ssl: {
	  rejectUnauthorized: false,
      }
    };
  } else if (configExist) {
  const {
    username, password, database, host
  } = config;

  const poolOptions = {
    port: DB_PORT,
    user: username, password, database, host,
  };

  storeOptions.pool = new Pool(poolOptions);

  console.log("Testing store connection with pool:", poolOptions);
  storeOptions.pool.query("SELECT NOW();", (err, res) => {
    if (err) {
      console.error(err);
      console.error("Failed to connect to database, terminating...");
      process.exit(1);
    }

    console.log("Store connected!");
  });
} else throw new TypeError("No DATABASE_URL in env and no `config/config.json` file to connect to database!");

console.log("Using store:", storeOptions);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: [true, "true", 1].includes(process.env.COOKIE_SECURE),
    sameSite: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
  store: new (require("connect-pg-simple")(session))(storeOptions)
}));

app.use("/", router);

app.listen(Number(PORT));
