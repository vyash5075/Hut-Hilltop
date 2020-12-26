const Order = require("../../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
function orderController() {
  return {
    store(req, res) {
      //validate request
      const { phone, address, stripeToken, paymentType } = req.body;
      console.log(req.user._id);
      if (!phone || !address) {
        return res.status(422).json({ message: "All fields are Required" });
        // req.flash("error", "All fields are required!!");
        // return res.redirect("/");
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
          Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
            // req.flash("success", "order placed Successfully!!");
            //stripe payment
            if (paymentType === "card") {
              stripe.charges
                .create({
                  amount: req.session.cart.totalPrice * 100,
                  source: stripeToken,
                  currency: "inr",
                  description: `Pizza order:${placedOrder._id}`,
                })
                .then(() => {
                  placedOrder.paymentStatus = true;
                  placedOrder.paymentType = paymentType;
                  placedOrder
                    .save()
                    .then((ord) => {
                      console.log(ord);
                      const eventEmitter = req.app.get("eventEmitter");
                      eventEmitter.emit("orderPlaced", ord);
                      delete req.session.cart;

                      return res.json({ message: "Payment successfull" });
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => {
                  delete req.session.cart;
                  return res.json({
                    message: "Payment failed,You can pay at delivery time",
                  });
                });
            } else {
              delete req.session.cart;
              return res.json({
                message: "Payment placed successfully",
              });
            }

            //Emit event
            // const eventEmitter = req.app.get("eventEmitter");
            // eventEmitter.emit("orderPlaced", placedOrder);

            // res.redirect("/customer/orders");
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "something went wrong",
          });
          // console.log(err);
          // req.flash("error", "Something went wrong!!");
          // res.redirect("/cart");
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
