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
      res.header("Cache-Control", "no-store");
      res.render("customers/orders", { orders: orders, moment: moment });
    },
    async show(req, res) {
      console.log(req.params.id);
      const order = await Order.findById({ _id: req.params.id });
      //authorize user
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customers/singleorder", { order: order });
      } else {
        return res.redirect("/");
      }
    },
  };
}
module.exports = orderController;
