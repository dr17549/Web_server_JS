//for express to connect to .env files
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const routes = require("./routes/index");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(express.static("public"));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist/"));
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist/")
);
app.use(
  "/bootstrap-tagsinput",
  express.static(__dirname + "/node_modules/bootstrap4-tagsinput//")
);
app.use(
  "/popper.js",
  express.static(__dirname + "/node_modules/popper.js/dist/")
);
app.use(
  "/fontawesome",
  express.static(__dirname + "/node_modules/@fortawesome/fontawesome-free")
);
app.use("/d3", express.static(__dirname + "/node_modules/d3/dist"));

//connect to mongoose

mongoose.connect("mongodb://localhost/subscribers", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

//telling express that it needs to use json
app.use(express.json());
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//tells the server that when it receives the routes, it must come to this path for what todo
// in GET, POST, UPDATE methods
// const subscribersRouter = require('./routes/subscribers')
// app.use('/subscribers', subscribersRouter)
app.use(
  session({
    secret: "my-secret",
    resave: true,
    saveUninitialized: false,
  })
);

app.use("/", routes);

const userRouter = require("./routes/user_session");
app.use("/", userRouter);

app.listen(3000, () => console.log("server started"));
