import api from "../utils/axios";

export const submitRating = (storeId, data) => {
  return api.post(`/stores/${storeId}/ratings`, data);
};

export const updateRating = (storeId, data) => {
  return api.put(`/stores/${storeId}/ratings`, data);
};
console.log("rating api loaded");
