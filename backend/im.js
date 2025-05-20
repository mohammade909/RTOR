const moment = require("moment");
const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'toor123',
    database: 'silver',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function importFinrainToUsers() {
    try {
        console.log("🚀 Starting Data Import...");

        const finrainQuery = "SELECT * FROM finrain";
        const [finrainData] = await db.query(finrainQuery);

        if (finrainData.length === 0) {
            console.log("⚠️ No records found in finrain table.");
            return;
        }

        console.log(`✅ Found ${finrainData.length} records in finrain.`);

        for (const row of finrainData) {
            try {
                const {
                    idno,
                    active_plan,
                    business, 
                    roi_income, 
                    booster_income, 
                    roi_income_day, 
                    level_inccome, 
                    reward, 
                    activation_date, 
                    created_at, 
                    cto_total, 
                    withdrwal
                } = row;

                console.log(`🔹 Processing User: ${idno}`);

                if (!idno) {
                    console.log("⚠️ Skipping entry with missing username.");
                    continue;
                }

                // Convert dates to MySQL format
                const formattedActivationDate = moment(activation_date, "DD-MM-YYYY").format("YYYY-MM-DD");
                const formattedCreatedAt = moment(created_at, "DD-MM-YYYY").format("YYYY-MM-DD");

                // Check if user exists in `users` table
                const checkUserQuery = "SELECT id FROM users WHERE username = ?";
                const [existingUser] = await db.query(checkUserQuery, [idno]);

                if (existingUser.length === 0) {
                    console.log(`⚠️ User ${idno} not found in users table, skipping...`);
                    continue;
                }

                const userid = existingUser[0].id; // ✅ Get the `id` from `users` table
                console.log(`✅ User ${idno} found with ID: ${userid}`);
                const withdrawalAmount = parseFloat(withdrwal) || 0;

                const originalAmount = withdrawalAmount / 0.95; // Find total before 5% deduction
                const deduction = originalAmount * 0.05; 



                let working_amount = 0;
                let non_working_amount = 0;
                const totalEarnings = level_inccome + reward + cto_total;

                // Ensure `withdrwal` is a number

                if (withdrawalAmount > totalEarnings) {
                    working_amount = level_inccome + reward + roi_income + booster_income + cto_total - (originalAmount);
                    non_working_amount = 0;
                } else {
                    working_amount = level_inccome + reward + cto_total - (originalAmount);
                    non_working_amount = roi_income + booster_income;
                }

                console.log(`💰 Calculated Working: ${working_amount}, Non-Working: ${non_working_amount}`);

                // ✅ Update the existing user
                const updateQuery = `
                    UPDATE users 
                    SET 
                    active_plan=?, 
                    business=?, 
                    roi_income=?, 
                    roi_income_day=?, 
                    level_month=?, 
                    reward=?, 
                    working=?, 
                    non_working=?, 
                    activation_date=?, 
                    created_at=?, 
                    cto=?
                    WHERE username = ?
                `;

                await db.query(updateQuery, [
                    active_plan,
                    business, 
                    roi_income + booster_income, 
                    roi_income_day, 
                    level_inccome, 
                    reward, 
                    working_amount,
                    non_working_amount,
                    formattedActivationDate, 
                    formattedCreatedAt, 
                    cto_total > 0 ? "true" : "false", 
                    idno
                ]);

                console.log(`✅ Updated User ${idno} successfully.`);

                // ✅ Calculate the original amount (100%) & deduction (5%)
                // 5% deduction

                console.log(`💰 Withdrawal: ${withdrawalAmount}, Deduction: ${deduction}`);

                // ✅ Insert withdrawal request (fixing syntax)
                const withdrawalQuery = `
                    INSERT INTO withdrawal_request(user_id, amount, status, createdAT, acceptat, type, deduction) 
                    VALUES (?, ?, 'complete', NOW(), NOW(), 'working', ?)
                `;

                await db.query(withdrawalQuery, [userid, withdrawalAmount, deduction]);

                console.log(`✅ Withdrawal request inserted for User ${idno}.\n`);
            } catch (rowError) {
                console.error(`❌ Error processing User ${row.idno}:`, rowError);
            }
        }

        console.log("✅ Data transfer completed successfully.");
        return {
            success: true,
            message: "Data transfer completed successfully"
        };

    } catch (error) {
        console.error("❌ Error in importFinrainToUsers function:", error);
        return {
            success: false,
            message: "Error transferring data",
            error: error.message
        };
    }
}

importFinrainToUsers();
