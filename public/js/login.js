/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password
      }
    });
    // console.log(res);
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout"
    });
    if (res.data.status === "success") location.reload(true);
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};
// document.querySelector('.form').addEventListener('submit', e => {
//   e.preventDefault();
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;

//   login(email, password);
// });
