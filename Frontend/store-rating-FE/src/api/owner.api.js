import api from "../utils/axios";

export const getOwnerDashboard = (ownerId) => {
  return api.get(
    `/stores/owner/dashboard?ownerId=${ownerId}&requestedByRole=STORE_OWNER`
  );
};
