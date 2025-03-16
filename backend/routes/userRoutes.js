const express = require("express");
const {
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers
} = require("../controllers/userController");  // Ensure this path is correct

const router = express.Router();

// Ensure all controller functions exist
console.log({ getUserById, updateUserById, deleteUserById, getAllUsers });

// Get user by ID
router.get("/:id", getUserById);

// Update user by ID
router.put("/:id", updateUserById);

// Delete user by ID
router.delete("/:id", deleteUserById);

// Get all users (Admin only)
router.get("/", getAllUsers);

module.exports = router;
