const db = require("../config/database");

// Create a new bonus
const createBonus = (amount, bonus_type, status = "pending") => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO bonuses (amount, bonus_type, status)
            VALUES (?, ?, ?)
        `;
        db.query(query, [amount, bonus_type, status], (err, result) => {
            if (err) {
                return reject({ message: "Database error", error: err });
            }
            resolve({ message: "Bonus added successfully", bonus_id: result.insertId });
        });
    });
};

// Get all bonuses
const getBonuses = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM bonuses ORDER BY created_at DESC";
        db.query(query, (err, results) => {
            if (err) {
                return reject({ message: "Database error", error: err });
            }
            resolve(results);
        });
    });
};

// Get a specific bonus by ID
const getBonusById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM bonuses WHERE id = ?";
        db.query(query, [id], (err, result) => {
            if (err) {
                return reject({ message: "Database error", error: err });
            }
            resolve(result[0]);
        });
    });
};

// Update a bonus (Admin Only)
const updateBonus = (id, updateFields) => {
    return new Promise((resolve, reject) => {
      // Validate inputs
      if (!id) {
        return reject({ message: "Bonus ID is required" });
      }
      
      if (!updateFields || Object.keys(updateFields).length === 0) {
        return reject({ message: "No update fields provided" });
      }
      
      // Build dynamic query based on provided fields
      const fieldEntries = Object.entries(updateFields).filter(([_, value]) => value !== undefined);
      
      if (fieldEntries.length === 0) {
        return reject({ message: "No valid update fields provided" });
      }
      
      // Create SET part of query using field names and parameter placeholders
      const setClause = fieldEntries.map(([field]) => `${field} = ?`).join(', ');
      const query = `UPDATE bonuses SET ${setClause} WHERE id = ?`;
      
      // Extract values in same order as SET fields
      const values = [...fieldEntries.map(([_, value]) => value), id];
      
      // Execute query
      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Database error when updating bonus:", err);
          return reject({ message: "Database error", error: err });
        }
        
        if (result.affectedRows === 0) {
          return reject({ message: "Bonus not found or no changes made", status: 404 });
        }
        
        resolve({ 
          message: "Bonus updated successfully", 
          updatedFields: Object.keys(updateFields),
          bonusId: id,
          changedRows: result.changedRows
        });
      });
    });
  };

// Delete a bonus (Admin Only)
const deleteBonus = (id) => {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM bonuses WHERE id = ?";
        db.query(query, [id], (err, result) => {
            if (err) {
                return reject({ message: "Database error", error: err });
            }
            if (result.affectedRows === 0) {
                return reject({ message: "Bonus not found" });
            }
            resolve({ message: "Bonus deleted successfully" });
        });
    });
};

module.exports = { createBonus, getBonuses, getBonusById, updateBonus, deleteBonus };
