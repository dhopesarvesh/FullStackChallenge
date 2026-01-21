import api from "../utils/axios.js";

// Login
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// Signup (Normal User only)
export const signupUser = (data) => {
  return api.post("/auth/signup", data);
};

// Forgot password
export const forgotPassword = (data) => {
  return api.post("/auth/forgot-password", data);
};

// Update password (after login)
export const updatePassword = (data) => {
  return api.post("/auth/update-password", data);
};
