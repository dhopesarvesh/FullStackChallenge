import bcrypt from "bcrypt";
import db from "../config/db.js";
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress
} from "../utils/validators.js";

export const addUserByAdmin = async (req, res) => {
  try {
   
    if (req.body.requestedByRole !== "ADMIN") {
      return res.status(403).json({
        message: "Only admin can add users"
      });
    }

    const { name, email, password, address, role } = req.body;

    
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!["ADMIN", "USER", "STORE_OWNER"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    if (!isValidName(name)) {
      return res.status(400).json({
        message: "Name must be 20–60 characters"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8–16 chars, include 1 uppercase & 1 special char"
      });
    }

    if (!isValidAddress(address)) {
      return res.status(400).json({
        message: "Address must be max 400 characters"
      });
    }

   
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    await db.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, address, role]
    );

    return res.status(201).json({
      message: "User added successfully by admin"
    });
  } catch (error) {
    console.error("Admin add user error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const addStoreByAdmin = async (req, res) => {
    try {
     
      if (req.body.requestedByRole !== "ADMIN") {
        return res.status(403).json({
          message: "Only admin can add stores"
        });
      }
  
      const { name, email, address, ownerId } = req.body;
  
     
      if (!name || !email || !address || !ownerId) {
        return res.status(400).json({
          message: "All fields are required"
        });
      }
  
      if (address.length > 400) {
        return res.status(400).json({
          message: "Address must be max 400 characters"
        });
      }
  
     
      const [owners] = await db.query(
        "SELECT id, role FROM users WHERE id = ?",
        [ownerId]
      );
  
      if (owners.length === 0) {
        return res.status(404).json({
          message: "Store owner not found"
        });
      }
  
      if (owners[0].role !== "STORE_OWNER") {
        return res.status(400).json({
          message: "User is not a store owner"
        });
      }
  
     
      const [existingStore] = await db.query(
        "SELECT id FROM stores WHERE email = ?",
        [email]
      );
  
      if (existingStore.length > 0) {
        return res.status(409).json({
          message: "Store with this email already exists"
        });
      }
  
      
      await db.query(
        `INSERT INTO stores (name, email, address, owner_id)
         VALUES (?, ?, ?, ?)`,
        [name, email, address, ownerId]
      );
  
      return res.status(201).json({
        message: "Store added successfully"
      });
    } catch (error) {
      console.error("Admin add store error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };
  export const getAdminDashboard = async (req, res) => {
    try {
      
      if (req.query.requestedByRole !== "ADMIN") {
        return res.status(403).json({
          message: "Only admin can access dashboard"
        });
      }
  
      
      const [usersCount] = await db.query(
        "SELECT COUNT(*) AS totalUsers FROM users"
      );
  
      
      const [storesCount] = await db.query(
        "SELECT COUNT(*) AS totalStores FROM stores"
      );
  
      
      const [ratingsCount] = await db.query(
        "SELECT COUNT(*) AS totalRatings FROM ratings"
      );
  
      return res.status(200).json({
        totalUsers: usersCount[0].totalUsers,
        totalStores: storesCount[0].totalStores,
        totalRatings: ratingsCount[0].totalRatings
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  export const getAllUsersByAdmin = async (req, res) => {
    try {
    
      if (req.query.requestedByRole !== "ADMIN") {
        return res.status(403).json({
          message: "Only admin can view users"
        });
      }
  
      const [users] = await db.query(
        `SELECT id, name, email, address, role
         FROM users
         ORDER BY created_at DESC`
      );
  
      return res.status(200).json({
        count: users.length,
        users
      });
    } catch (error) {
      console.error("Get users error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  export const getAllStoresByAdmin = async (req, res) => {
    try {
      // TEMP role check (Option 1)
      if (req.query.requestedByRole !== "ADMIN") {
        return res.status(403).json({
          message: "Only admin can view stores"
        });
      }
  
      const [stores] = await db.query(
        `SELECT 
            s.id,
            s.name,
            s.email,
            s.address,
            ROUND(AVG(r.rating), 1) AS rating
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         GROUP BY s.id
         ORDER BY s.created_at DESC`
      );
  
      return res.status(200).json({
        count: stores.length,
        stores
      });
    } catch (error) {
      console.error("Get stores error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };
  
  
  
