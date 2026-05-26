import axios from "axios";


const API = axios.create({

  baseURL: "http://127.0.0.1:8000",
});


// ✅ Attach Access Token Automatically
API.interceptors.request.use(

  (req) => {

    const token = localStorage.getItem("token");

    if (token) {

      req.headers.Authorization =
        `Bearer ${token}`;
    }

    return req;
  },

  (error) => {

    return Promise.reject(error);
  }
);


// ✅ Auto Refresh Expired Token
API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // ✅ Access Token Expired
    if (

      error.response?.status === 401

      && !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem(
            "refresh_token"
          );

        // ✅ Request New Access Token
        const response = await axios.post(

          "http://127.0.0.1:8000/auth/refresh",

          {
            refresh_token: refreshToken
          }
        );

        const newAccessToken =
          response.data.access_token;

        // ✅ Save New Token
        localStorage.setItem(
          "token",
          newAccessToken
        );

        // ✅ Retry Failed Request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return API(originalRequest);

      } catch (refreshError) {

        console.log(
          "Refresh token expired"
        );

        // ✅ Logout User
        localStorage.clear();

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;