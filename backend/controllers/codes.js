const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");


// Create multiple codes
exports.createCodes = catchAsyncErrors(async (req, res, next) => {
    const { codes } = req.body;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
        return res.status(400).json({ success: false, message: 'Codes array is required' });
    }

    const values = codes.map(code => [code]);
    const query = 'INSERT INTO used_codes (code) VALUES ?';

    db.query(query, [values], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(201).json({ success: true, message: 'Codes created successfully', affectedRows: result.affectedRows });
    });
});

// Get all codes
exports.getCodes = catchAsyncErrors(async (req, res, next) => {
    const query = 'SELECT * FROM used_codes';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(200).json({ success: true, codes: results });
    });
});

// Get a single code by ID
exports.getCodeById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const query = 'SELECT * FROM used_codes WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Code not found' });
        }
        res.status(200).json({ success: true, code: result[0] });
    });
});
