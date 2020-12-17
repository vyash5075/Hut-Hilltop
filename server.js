const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const PORT = process.env.PORT | 4000;
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);
//database connection
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.7blaf.mongodb.net/hulhilltop?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// mongoose.connection.once("open", () => {
//   console.log("mongo connection establish successfully");
// }).catch(err=>{cosole.log('connection failed)})                 another way of writing

mongoose.connection.on("connected", () => {
  console.log("mongo connection establish successfully");
});
mongoose.connection.on("error", () => {
  console.group("Mongoose connection failed");
});

const connection = mongoose.connection;
//session store
let mongostore = new MongoDbStore({
  mongooseConnection: connection,
  collection: "sessions",
});

//session configuration
app.use(
  session({
    secret: process.env.COOKIE_SECRET, //session does not work without cookies
    resave: false,
    store: mongostore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hours
  })
);

app.use(flash());
//Assets
app.use(express.static("public"));
app.use(express.json()); //json data receive krne ke liye

//Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
//set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
