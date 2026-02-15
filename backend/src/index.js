import dotenv from "dotenv";
import app from "./app.js";
import db from "./config/database.js";

dotenv.config({ path: "./backend/.env" });

const startServer = async () => {
  try {
    // Test DB connection
    await db.query("SELECT 1");
    console.log(" Database connected");

    // Start server
    app.listen(process.env.PORT || 8000, () => {
      console.log(` Server running on port ${process.env.PORT || 8000}`);
    });
  } catch (error) {
    console.log(" Database connection failed");
    console.error(error);
  }
};

startServer();
