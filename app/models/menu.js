const mongoose = require("mongoose");
const Schema = mongoose.Schema; // schema is a class or constructor function

const menuSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("menu", menuSchema);
