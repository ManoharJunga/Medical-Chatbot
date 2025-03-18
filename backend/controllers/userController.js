const User = require("../models/User.model");

// Get user by ID (Admin or self)
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from URL
        const user = await User.findById(userId).select("-password"); // Exclude password

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

// Update user by ID (Admin or self)
exports.updateUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from URL
        const { name, phone, dob, gender } = req.body;

        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phone, dob, gender },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete user by ID (Admin or self)
exports.deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from URL
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

