/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
// export const updateSettings = async (name, email) => {
//   // const url = type === "password" ? "/api/v1/users/updateMyPassword" : "/api/v1/users/updateMe";
//   try {
//     const res = await axios({
//       method: "PATCH",
//       url: "/api/v1/users/updateMe",
//       data: {
//         name,
//         email
//       }
//     });
//     if (res.data.status === "success") {
//       showAlert("success", `Data updated successfully!`);
//     }
//   } catch (err) {
//     console.log(err.response);
//     showAlert("error", err.response.data.message);
//   }
// };

export const updateSettings = async (data, type) => {
  const url =
    type === "password"
      ? "/api/v1/users/updateMyPassword"
      : "/api/v1/users/updateMe";
  try {
    const res = await axios({
      method: "PATCH",
      url,
      data
    });
    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    // console.log(err.response);
    showAlert("error", err.response.data.message);
  }
};
