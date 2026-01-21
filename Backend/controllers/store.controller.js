import db from "../config/db.js";

export const getAllStores = async (req, res) => {
  try {
    const { userId } = req.query;

    let query;
    let params = [];

    if (userId) {
      query = `
        SELECT 
          s.id,
          s.name,
          s.address,
          ROUND(AVG(r.rating), 1) AS overallRating,
          ur.rating AS userRating,
          ur.feedback AS userFeedback
        FROM stores s
        LEFT JOIN ratings r 
          ON s.id = r.store_id
        LEFT JOIN ratings ur 
          ON s.id = ur.store_id AND ur.user_id = ?
        GROUP BY s.id
      `;
      params = [userId];
    } else {
      query = `
        SELECT 
          s.id,
          s.name,
          s.address,
          ROUND(AVG(r.rating), 1) AS overallRating
        FROM stores s
        LEFT JOIN ratings r 
          ON s.id = r.store_id
        GROUP BY s.id
      `;
    }

    const [stores] = await db.query(query, params);

    res.status(200).json({
      count: stores.length,
      stores
    });
  } catch (error) {
    console.error("Get stores error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};


export const searchStores = async (req, res) => {
    try {
      const { name = "", address = "" } = req.query;
  
      const [stores] = await db.query(
        `SELECT 
            s.id,
            s.name,
            s.address,
            ROUND(AVG(r.rating), 1) AS overallRating
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.name LIKE ? 
           AND s.address LIKE ?
         GROUP BY s.id
         ORDER BY s.created_at DESC`,
        [`%${name}%`, `%${address}%`]
      );
  
      return res.status(200).json({
        count: stores.length,
        stores
      });
    } catch (error) {
      console.error("Search stores error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  export const getStoreOwnerDashboard = async (req, res) => {
    try {
      const { requestedByRole, ownerId } = req.query;
  
     
      if (requestedByRole !== "STORE_OWNER") {
        return res.status(403).json({
          message: "Only store owners can access this dashboard"
        });
      }
  
      if (!ownerId) {
        return res.status(400).json({
          message: "ownerId is required"
        });
      }
  
      
      const [stores] = await db.query(
        "SELECT id, name FROM stores WHERE owner_id = ?",
        [ownerId]
      );
  
      if (stores.length === 0) {
        return res.status(404).json({
          message: "No store found for this owner"
        });
      }
  
      const storeId = stores[0].id;
      const storeName = stores[0].name;
  
  
      const [ratings] = await db.query(
        `SELECT 
            u.id AS userId,
            u.name AS userName,
            u.email AS userEmail,
            r.rating,
            r.feedback
         FROM ratings r
         JOIN users u ON r.user_id = u.id
         WHERE r.store_id = ?`,
        [storeId]
      );
  

      const [avgResult] = await db.query(
        "SELECT ROUND(AVG(rating), 1) AS averageRating FROM ratings WHERE store_id = ?",
        [storeId]
      );
  
      return res.status(200).json({
        store: {
          id: storeId,
          name: storeName,
          averageRating: avgResult[0].averageRating
        },
        totalRatings: ratings.length,
        ratings
      });
    } catch (error) {
      console.error("Store owner dashboard error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };
  
  