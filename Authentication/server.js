//for express to connect to .env files
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

//connect to mongoose
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connected to database"));

//telling express that it needs to use json
app.use(express.json());
app.set("view engine", "pug");

//tells the server that when it receives the routes, it must come to this path for what todo
// in GET, POST, UPDATE methods
// const subscribersRouter = require('./routes/subscribers')
// app.use('/subscribers', subscribersRouter)
app.use(
  session({
    secret: "my-secret",
    resave: true,
    saveUninitialized: false
  })
);

const userRouter = require("./routes/user_session");
app.use("/user_session", userRouter);

app.listen(3000, () => console.log("server started"));
