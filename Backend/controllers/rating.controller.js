import db from "../config/db.js";

export const submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating, userId, feedback, requestedByRole } = req.body;

    if (requestedByRole !== "USER") {
      return res.status(403).json({
        message: "Only normal users can submit ratings"
      });
    }


    if (!storeId || userId === undefined || rating === undefined) {
      return res.status(400).json({
        message: "storeId, rating and userId are required"
      });
    }

    const numericRating = Number(rating);

    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }


    const [store] = await db.query(
      "SELECT id FROM stores WHERE id = ?",
      [storeId]
    );

    if (store.length === 0) {
      return res.status(404).json({
        message: "Store not found"
      });
    }


    const [existingRating] = await db.query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existingRating.length > 0) {
      return res.status(409).json({
        message: "You have already rated this store"
      });
    }


    await db.query(
      `INSERT INTO ratings (user_id, store_id, rating, feedback)
       VALUES (?, ?, ?, ?)`,
      [userId, storeId, numericRating, feedback || null]
    );

    return res.status(201).json({
      message: "Rating and feedback submitted successfully"
    });
  } catch (error) {
    console.error("Submit rating error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


export const updateRating = async (req, res) => {
    try {
      const { storeId } = req.params;
      const { rating, userId, feedback, requestedByRole } = req.body;
  
      if (requestedByRole !== "USER") {
        return res.status(403).json({
          message: "Only normal users can update ratings"
        });
      }
  
      if (!storeId || userId === undefined || rating === undefined) {
        return res.status(400).json({
          message: "storeId, userId and rating are required"
        });
      }
  
      const numericRating = Number(rating);
  
      if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5"
        });
      }
  
      const [existingRating] = await db.query(
        "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
        [userId, storeId]
      );
  
      if (existingRating.length === 0) {
        return res.status(404).json({
          message: "No existing rating found to update"
        });
      }
  
      
      await db.query(
        `UPDATE ratings 
         SET rating = ?, feedback = ?
         WHERE user_id = ? AND store_id = ?`,
        [numericRating, feedback || null, userId, storeId]
      );
  
      return res.status(200).json({
        message: "Rating updated successfully"
      });
    } catch (error) {
      console.error("Update rating error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };
  
  