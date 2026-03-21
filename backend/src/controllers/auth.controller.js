import db from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendOTP } from "../config/email.js";

// Helper function to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Step 1: Register user - Send OTP to email
export const registerUser = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    // Validation: required fields
    if (!username || !password || !email) {
      return res.status(400).json({
        message: "Username, password, and email are required",
      });
    }

    // Validation: email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validation: password complexity
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long, and include at least one number and one symbol",
      });
    }

    // Validation: phone format (if provided)
    if (phone && phone.trim() !== "") {
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: "Phone number must be at least 10 digits",
        });
      }
    }

    // Check if username already exists
    const [usernameRows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (usernameRows.length > 0) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Check if email already exists in users table
    const [emailRows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (emailRows.length > 0) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Check if email already has pending OTP
    const [pendingOTP] = await db.query(
      "SELECT * FROM otp_codes WHERE email = ? AND is_used = 0 AND expires_at > NOW()",
      [email]
    );
    if (pendingOTP.length > 0) {
      return res.status(400).json({
        message: "OTP already sent to this email. Check your email.",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database (expiration 10 minutes from now using MySQL timezone)
    await db.query(
      "INSERT INTO otp_codes (email, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
      [email, otp]
    );

    // Send OTP via email
    const emailResult = await sendOTP(email, otp);
    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send OTP. Please try again.",
      });
    }

    // Return success - OTP sent, waiting for verification
    res.status(200).json({
      message: "OTP sent to your email. Valid for 10 minutes.",
      email: email, // Send back email so frontend knows where OTP was sent
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Step 2: Verify OTP and create user account
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp_code, username, password, phone } = req.body;

    // Validation
    if (!email || !otp_code) {
      return res.status(400).json({
        message: "Email and OTP code are required",
      });
    }

    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp_code)) {
      return res.status(400).json({
        message: "OTP must be 6 digits",
      });
    }

    // Check if OTP exists and is valid and not expired
    const [otpRecords] = await db.query(
      "SELECT * FROM otp_codes WHERE email = ? AND otp_code = ? AND is_used = 0 AND expires_at > NOW()",
      [email, otp_code]
    );

    if (otpRecords.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired OTP code",
      });
    }

    const otpRecord = otpRecords[0];

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const sql =
      "INSERT INTO users (username, password, email, phone, verified) VALUES (?, ?, ?, ?, 1)";
    await db.query(sql, [username, hashedPassword, email, phone || null]);

    // Mark OTP as used
    await db.query("UPDATE otp_codes SET is_used = 1 WHERE id = ?", [
      otpRecord.id,
    ]);

    // Generate JWT token
    const [newUser] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    const token = jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Registration successful",
      token: token,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ 
      message: error.sqlMessage || error.message || "Internal Server Error" 
    });
  }
};

// Login user - supports both username and email
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username/Email and password are required",
      });
    }

    // Query by username OR email
    const [rows] = await db.query(
      "SELECT * FROM users WHERE (username = ? OR email = ?) AND verified = 1",
      [username, username]
    );

    // User not found or not verified
    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials or account not verified",
      });
    }

    const user = rows[0];

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
      username: user.username,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
