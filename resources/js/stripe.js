import { loadStripe } from "@stripe/stripe-js";
import { CardWidget } from "./CardWidget";
import { placeOrder } from "./apiService";
// import Noty from "noty";
export async function initStripe() {
  const stripe = await loadStripe(
    "pk_test_51I2X3hGrayEPOSYzNuST8qTapfnQPj1h1QOQNfSR55XKZGBBT4xGCOh6kabo5nXlUpOBTNYRIpbnQzFFtihHUULY00VChVzHD6"
  );

  let card = null;

  const paymentType = document.querySelector("#paymentType");
  if (!paymentType) {
    return;
  }
  paymentType.addEventListener("change", (e) => {
    if (e.target.value === "card") {
      // Display Widget
      card = new CardWidget(stripe);
      card.mount();
    } else {
      card.destroy();
    }
  });

  // Ajax call
  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(paymentForm);
      let formObject = {};
      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      if (!card) {
        // Ajax
        placeOrder(formObject);
        return;
      }

      const token = await card.createToken();
      formObject.stripeToken = token.id;
      placeOrder(formObject);

      // // Verify card
      // stripe.createToken(card).then((result) => {
      //     formObject.stripeToken = result.token.id;
      //     placeOrder(formObject);
      // }).catch((err) => {
      //     console.log(err)
      // })
    });
  }
}

//   const elements = stripe.elements();
//   let card = elements.create("card", { style: {} });
//   card.mount("#card-element");
//   const paymentType = document.querySelector("#paymentType");
//   paymentType.addEventListener("change", (e) => {
//     console.log(e);
//     if (e.target.value === "card") {
//     } else {
//     }
//   });
//   //ajax call

//   const paymentForm = document.querySelector("#payment-form");
//   if (paymentForm) {
//     paymentForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       let formData = new FormData(paymentForm);
//       let formObject = {};
//       for (let [key, value] of formData.entries()) {
//         formObject[key] = value;
//       }
//       axios
//         .post("/orders", formObject)
//         .then((res) => {
//           console.log(res.data);
//           new Noty({
//             type: "success",
//             timeout: 1000,
//             text: res.data.success,
//             progressBar: false,
//           }).show();
//           setTimeout(() => {
//             window.location.href = "/customer/orders";
//           }, 1000);
//         })
//         .catch((err) => {
//           console.log(err);
//           new Noty({
//             type: "success",
//             timeout: 1000,
//             text: res.data.success,
//             progressBar: false,
//           }).show();
//         });
//       console.log(formObject);
//     });
//   }
// }
