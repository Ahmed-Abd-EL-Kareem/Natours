/* eslint-disable */
// import axios from 'axios';
import "@babel/polyfill";
import { login, logout } from "./login";
import { signup } from "./signup";
import { updateSettings } from "./updateSettings";
import { displayMap } from "./mapbox";
import { bookTour } from "./stripe";
import { showAlert } from "./alert";
// DOM Elements
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form-signup");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-settings");
const bookTourBtn = document.getElementById("book-tour");
// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
// const locations = JSON.parse(document.getElementById("map").dataset.locations);
// displayMap(locations);
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    signup(name, email, password, passwordConfirm);
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (userDataForm) {
  userDataForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    updateSettings(form, "data");
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );
    // Clear input fields
    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (bookTourBtn) {
  bookTourBtn.addEventListener("click", async e => {
    // e.preventDefault();
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;
    await bookTour(tourId);
    e.target.textContent = "Book tour now!";
  });
}

const alert = document.querySelector("body").dataset.alert;
if (alert) {
  showAlert("success", alert, 20);
}
