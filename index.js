// declarement
const express = require("express");
const path = require('path');
const xss = require("xss-clean");
const app = express();
require("dotenv").config();
const note = require("./route/note.js");
const user = require("./route/user.js");
const auth = require("./route/auth.js");
const errorHandler = require("./middleware/error.js");

app.use("/public", express.static(path.join(__dirname, "public")));
//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// middleware
app.use(xss());
app.use("/note", note);
app.use("/user", user);
app.use("/auth", auth);

app.use(errorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(
    port,
    console.log(`Running in Mode ${process.env.MODE} in Port ${port}`)
);
process.on('uncaughtException', (err, promise) => {
    console.log(err.message);
})