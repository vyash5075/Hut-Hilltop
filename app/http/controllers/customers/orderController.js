const Order = require("../../../models/order");
const moment = require("moment");
function orderController() {
  return {
    store(req, res) {
      //validate request
      const { phone, address } = req.body;
      console.log(req.user._id);
      if (!phone || !address) {
        req.flash("error", "All fields are required!!");
        return res.redirect("/");
      }
      console.log(req.session.cart.items);
      const order = new Order({
        customerId: req.user._id, //from passport
        items: req.session.cart.items, // items is an object
        phone: phone,
        address: address,
      });
      order
        .save()
        .then((result) => {
          req.flash("success", "order placed Successfully!!");
          delete req.session.cart;
          res.redirect("/customer/orders");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "Something went wrong!!");
          res.redirect("/cart");
        });
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.render("customers/orders", { orders: orders, moment: moment });
    },
  };
}
module.exports = orderController;
