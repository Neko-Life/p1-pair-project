"use strict";

const express = require("express");
const router = require("./routes");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(3000);
