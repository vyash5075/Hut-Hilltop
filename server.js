const express = require("express");
const mongoose = require("mongoose");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const PORT = process.env.PORT | 4000;

//database connection
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.7blaf.mongodb.net/huthilltop?retryWrites=true&w=majority",
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
//Assets
app.use(express.static("public"));

//set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
