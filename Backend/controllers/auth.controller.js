import bcrypt from "bcrypt";
import db from "../config/db.js";
import  jwt  from "jsonwebtoken";
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress
} from "../utils/validators.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

 
    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidName(name)) {
      return res.status(400).json({
        message: "Name must be between 20 and 60 characters"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 chars, include 1 uppercase and 1 special character"
      });
    }

    if (!isValidAddress(address)) {
      return res.status(400).json({
        message: "Address must be max 400 characters"
      });
    }

  
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

 
    await db.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES (?, ?, ?, ?, 'USER')`,
      [name, email, hashedPassword, address]
    );


    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required"
        });
      }
  
      if (!isValidEmail(email)) {
        return res.status(400).json({
          message: "Invalid email format"
        });
      }
  
     
      const [rows] = await db.query(
        "SELECT id, name, email, password, role FROM users WHERE email = ?",
        [email]
      );
  
      if (rows.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }
  
      const user = rows[0];
  
     
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }
  
      
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role
        },
        "SECRET_KEY", 
        {
          expiresIn: "1h"
        }
      );
  
      
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  export const updatePassword = async (req, res) => {
    try {
      const { userId, oldPassword, newPassword } = req.body;
  
      if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({
          message: "userId, oldPassword and newPassword are required"
        });
      }
  
      if (!isValidPassword(newPassword)) {
        return res.status(400).json({
          message:
            "New password must be 8–16 chars, include uppercase & special character"
        });
      }
  
      // Fetch user
      const [users] = await db.query(
        "SELECT password FROM users WHERE id = ?",
        [userId]
      );
  
      if (users.length === 0) {
        return res.status(404).json({
          message: "User not found"
        });
      }
  
      // Compare old password
      const isMatch = await bcrypt.compare(oldPassword, users[0].password);
  
      if (!isMatch) {
        return res.status(401).json({
          message: "Old password is incorrect"
        });
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update password
      await db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId]
      );
  
      return res.status(200).json({
        message: "Password updated successfully"
      });
    } catch (error) {
      console.error("Update password error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  export const forgotPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      if (!email || !newPassword) {
        return res.status(400).json({
          message: "Email and newPassword are required"
        });
      }
  
      if (!isValidPassword(newPassword)) {
        return res.status(400).json({
          message:
            "Password must be 8–16 chars, include uppercase & special character"
        });
      }
  
      const [users] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
  
      if (users.length === 0) {
        return res.status(404).json({
          message: "Email not registered"
        });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await db.query(
        "UPDATE users SET password = ? WHERE email = ?",
        [hashedPassword, email]
      );
  
      return res.status(200).json({
        message: "Password reset successfully"
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };
  
