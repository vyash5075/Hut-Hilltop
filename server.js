const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const ejs = require("ejs");
const Emitter = require("events");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const PORT = process.env.PORT || 4001;
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);
const passport = require("passport");
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

//passport config

const connection = mongoose.connection;
//session store
let mongostore = new MongoDbStore({
  mongooseConnection: connection,
  collection: "sessions",
});

//eventEmitter
const eventEmitter = new Emitter(); //jese hi event emit hogi use listen bhi krna hoga
app.set("eventEmitter", eventEmitter); //eventemitter ko bind krdiya app ke sath

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
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session()); //passport sesiion ki help se chlta hai

app.use(flash());
//Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //json data receive krne ke liye

//Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
//set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

app.use((req, res) => {
  res.status(404).render("errors/404");
});

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

//socket

const io = require("socket.io")(server); // server pass krdiya ki hamne konsa server use krna hai socket ke liye
io.on("connection", (socket) => {
  //jese hi connection ho jayega  client ke sath toh hme use ek private room ke andr join krwana hai via passing callback
  //create and join in private room
  //jo order ki id hai wahi room ka naam denge
  console.log(socket.id); //har ek socket ki apni unique id hoti hai
  socket.on("join", (orderId) => {
    //receive kr rhe h client se data
    socket.join(orderId); //jo order id hamne receive ki h join method ki help  us name ki room create ho jayegi aur hum uske andr join ho jayenge
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data._id}`).emit("orderUpdated", data); //ab hume ye msg emit krna h private room ke andar
});
//ab hume emit kiya orderupdated aur ab hum ise client pr listen krenge  aur sath me updated data bhej denge

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
