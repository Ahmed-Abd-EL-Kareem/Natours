/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

const stripe = Stripe(
  "pk_test_51Rgi5qPwKIVpexd3JtjUFvemYeQyPOsN5KlCmwyiH6WSV50BENNxXEanhAwDrwwfX6bdwr1ZmMxfHtsV328OUqzP00xlIfTgzt"
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    // console.log(err);
    showAlert("error", err);
  }
};
