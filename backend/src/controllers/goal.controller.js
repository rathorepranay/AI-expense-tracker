import db from "../config/database.js";

export const addGoal = async (req, res) => {
  try {
    const userId = req.userID;
    const { title, target_amount, deadline } = req.body;
    
    await db.query(
      "INSERT INTO goals (user_id, title, target_amount, deadline) VALUES (?, ?, ?, ?)",
      [userId, title, target_amount, deadline]
    );
    res.status(200).json({ message: "Goal added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.userID;
    const [rows] = await db.query(
      "SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC", 
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addProgress = async (req, res) => {
  try {
    const userId = req.userID;
    const goalId = req.params.id;
    const { amount } = req.body;
    
    const [result] = await db.query(
      "UPDATE goals SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?",
      [amount, goalId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const userId = req.userID;
    const goalId = req.params.id;
    
    const [result] = await db.query("DELETE FROM goals WHERE id = ? AND user_id = ?", [goalId, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
