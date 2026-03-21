import db from "./src/config/database.js";

async function createGoalsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS goals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        target_amount DECIMAL(10, 2) NOT NULL,
        current_amount DECIMAL(10, 2) DEFAULT 0.00,
        deadline DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await db.query(query);
    console.log("Goals table created successfully");
  } catch (err) {
    console.error("Error creating goals table:", err);
  } finally {
    process.exit(0);
  }
}

createGoalsTable();
