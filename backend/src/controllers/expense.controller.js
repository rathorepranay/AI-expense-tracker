import db from "../config/database.js";

export const addExpense = async (req, res) => {
  try {
    const userId = req.userID;
    const { amount, category, note, date } = req.body;

    await db.query(
      "INSERT INTO expenses (user_id, amount, category, note, date) VALUES (?,?,?,?,?)",
      [userId, amount, category, note, date],
    );

    res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    res.status(500).json("Internal Server error");
  }
};

export const getExpenses = async (req, res) => {
  try {
    const userID = req.userID;

    const [rows] = await db.query(
      "SELECT * FROM expenses WHERE user_id = ? ORDER BY date desc",
      [userID],
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getSingleExpense = async (req, res) => {
  try {
    const userID = req.userID; // from middleware
    const expenseID = req.params.id;

    const [rows] = await db.query(
      "SELECT * FROM expenses WHERE id = ? AND user_id = ?",
      [expenseID, userID],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateExpense = async (req, res) => {
  try {
    const userID = req.userID;
    const expenseID = req.params.id;

    const { amount, category, note, date } = req.body;

    const sql = `UPDATE expenses SET amount = ?, category = ?, note = ?, date = ?
        WHERE id = ? AND user_id = ?`;

    const [result] = await db.query(sql, [
      amount,
      category,
      note,
      date,
      expenseID,
      userID,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      message: "Expense updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal  server error",
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const userID = req.userID;
    const id = req.params.id;

    await db.query("DELETE FROM expenses WHERE id = ? and user_id = ?", [
      id,
      userID,
    ]);

    return res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
