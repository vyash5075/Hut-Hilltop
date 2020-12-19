import axios from "axios";
import Noty from "noty";
let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCounter");
import { initAdmin } from "./admin";

function updateCart(pizza) {
  //axiox used for api integration
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      console.log(res);
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        timeout: 1000,
        progressBar: false,
        text: "Item Added to Cart",
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        progressBar: false,
        text: "Something Went Wrong",
      }).show();
    });
}
addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    console.log(e);
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

initAdmin();
