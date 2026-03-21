import db from "../config/database.js";
import regression from "regression";

export const getPrediction = async (req, res) => {
  try {
    const userId = req.userID;
    
    // Fetch all user expenses ordered chronologically
    const [expenses] = await db.query(
      "SELECT amount, date FROM expenses WHERE user_id = ? ORDER BY date ASC",
      [userId]
    );

    if (expenses.length === 0) {
      return res.status(200).json({
        prediction: 0,
        message: "Not enough data to run ML model. Keep logging your expenses!",
        isML: false
      });
    }

    // Determine the historical timeline bounds
    const firstDate = new Date(expenses[0].date);
    const lastDate = new Date(); // Use current date for total spanning weeks constraint
    
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const totalWeeksActive = Math.max(Math.ceil((lastDate - firstDate) / msInWeek), 1);
    
    const weeklyTotals = Array(totalWeeksActive).fill(0);

    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      let weekIndex = Math.floor((expDate - firstDate) / msInWeek);
      if (weekIndex >= totalWeeksActive) weekIndex = totalWeeksActive - 1;
      if (weekIndex < 0) weekIndex = 0; // Guard against anomalies
      
      weeklyTotals[weekIndex] += Number(exp.amount);
    });

    // Format for regression engine: [[1, spendW1], [2, spendW2], ...]
    const trainingData = weeklyTotals.map((total, index) => [index + 1, total]);

    if (trainingData.length < 2) {
       return res.status(200).json({
         prediction: trainingData[0][1],
         message: "Model needs at least 2 weeks of data for trajectory tracking. Serving direct average.",
         isML: false
       });
    }

    // Train a Linear Regression Model
    const result = regression.linear(trainingData);
    
    // Predict the Next Week (totalWeeksActive + 1)
    const nextWeekX = totalWeeksActive + 1;
    const predictionCoordinates = result.predict(nextWeekX);
    
    // Bound predictions to sensible positive numbers
    let predictedAmount = predictionCoordinates[1];
    if (predictedAmount < 0) predictedAmount = 0;

    res.status(200).json({
      prediction: Math.round(predictedAmount),
      equation: result.string, 
      message: "ML Model prediction successful",
      isML: true
    });

  } catch (error) {
    console.error("ML Error:", error);
    res.status(500).json({ message: "Internal server error during ML compute" });
  }
};
