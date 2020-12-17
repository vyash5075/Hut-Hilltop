const Menu = require("../../models/menu");
function homeController() {
  //factory functions= it is the type of pattern
  // factor functions el simply object creational pattern hai

  return {
    index(req, res) {
      Menu.find()
        .then((pizzas) => {
          console.log(pizzas);
          return res.render("home", { pizzas: pizzas });
        })
        .catch((err) => console.log(err));

      //another way by async await
      //   const pizzas = await Menu.find();
      //   console.log(pizzas);
      //   return res.render("home", { pizzas: pizzas });
    },
  };
}
module.exports = homeController;
