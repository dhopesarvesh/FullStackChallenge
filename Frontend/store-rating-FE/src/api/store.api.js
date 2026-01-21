import api from "../utils/axios";

export const getStores = (userId) => {
  if (userId) {
    return api.get(`/stores?userId=${userId}`);
  }
  return api.get("/stores");
};
