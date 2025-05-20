const { updateROIIncomeForUsers } = require('./CornJobController');
const { calculateCommissionForAllUsers } = require('./refferalController');
const { reward } = require('./rewardController');

const callAllFunctionsSequentially = async (req, res) => {
  try {
    // Call the first function
    await updateROIIncomeForUsers();

    // Wait for 5 seconds before calling the second function
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Call the second function
    await calculateCommissionForAllUsers();
    
    // Wait for another 5 seconds before calling the third function
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    // await blockUsersWithExcessWithdrawals();
    // Call the third function
    await reward();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Send the response after all functions are complete
    res.status(200).json({ message: "All functions executed successfully." });
  } catch (error) {
    console.error("Error in calling functions sequentially:", error);
    res.status(500).json({ message: "Error in executing functions.", error });
  }
};

module.exports = { callAllFunctionsSequentially };
