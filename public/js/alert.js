/* eslint-disable */
export const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};
// Type is 'success' or 'error'
export const showAlert = (type, msg, time = 7) => {
  hideAlert(); // Remove any existing alert before showing a new one
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, time * 1000); // Automatically hide the alert after 5 seconds
};
