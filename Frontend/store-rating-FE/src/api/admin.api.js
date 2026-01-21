import api from "../utils/axios";

export const getAdminDashboard = () => {
    return api.get("/admin/dashboard?requestedByRole=ADMIN");
  };
  
  export const getAllUsers = () => {
    return api.get("/admin/users?requestedByRole=ADMIN");
  };
  
  export const getAllStoresAdmin = () => {
    return api.get("/admin/stores?requestedByRole=ADMIN");
  };
  