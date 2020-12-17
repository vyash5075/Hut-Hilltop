const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const guest = require("../app/http/middleware/guest");
// jo bhi hum second function pass karte hai route ke sath (req,res ) automatically pass ho jate hai unke sath.

function initRoutes(app) {
  app.get("/", homeController().index);
  app.get("/cart", cartController().index);
  app.get("/login", guest, authController().login);

  app.post("/login", authController().postlogin);
  app.post("/logout", authController().logout);

  app.get("/register", guest, authController().register);
  app.post("/register", authController().postregister);
  app.post("/update-cart", cartController().update);
}

module.exports = initRoutes;
