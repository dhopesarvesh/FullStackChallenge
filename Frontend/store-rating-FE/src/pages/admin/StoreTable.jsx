import { useEffect, useState } from "react";
import { getAllStoresAdmin } from "../../api/admin.api";

const StoreTable = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      const res = await getAllStoresAdmin();
      setStores(res.data.stores);
    };

    fetchStores();
  }, []);

  return (
    <>
      <h3>Stores</h3>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.rating || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default StoreTable;
