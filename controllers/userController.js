const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Retrieve all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve a specific user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a specific user by ID
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a specific user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update the credit score of a user
exports.updateCreditScore = async (req, res) => {
    console.log("Request Body:", req.body); // Log incoming request body
    try {
        const { userId, action, ...otherDetails } = req.body;
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const scoreChange = action === 'positive' ? 20 : action === 'negative' ? -20 : 0;
        if (scoreChange !== 0) {
            user.creditScore = (user.creditScore || 0) + scoreChange;
        }
        
        Object.assign(user, otherDetails);
        await user.save();
        
        res.json(user);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(400).json({ error: error.message });
    }
};

