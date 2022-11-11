"use strict";

const express = require("express");
const session = require("express-session");
const PORT = process_env_PORT || 3000
const router = require("./routes");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "hallo hallo",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true,
  }
}));

app.use("/", router);

app.listen(PORT);
