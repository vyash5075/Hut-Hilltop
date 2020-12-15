const Menu = require("../../models/menu");
function homeController() {
  //factory functions= it is the type of pattern
  // factor functions el simply object creational pattern hai

  return {
    index: function(req, res) {
      Menu.find()
        .then((pizzas) => {
          return res.render("home", { pizzas: pizzas });
        })
        .catch((err) => console.log(err));
    },
  };
}
module.exports = homeController;
