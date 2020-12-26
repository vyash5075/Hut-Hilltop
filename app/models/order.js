const mongoose = require("mongoose");
const Schema = mongoose.Schema; // schema is a class or constructor function

const orderSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: {
      type: Object,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      default: "cod",
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "order_placed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("order", orderSchema);
