/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup', // Use relative path to avoid CORS
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert('An error occurred during signup. Please try again.');
    }
  }
};

// document.querySelector('.form-signup').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const name = document.getElementById('name').value;
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;
//   const passwordConfirm = document.getElementById('passwordConfirm').value;
//   signup(name, email, password, passwordConfirm);
// });
