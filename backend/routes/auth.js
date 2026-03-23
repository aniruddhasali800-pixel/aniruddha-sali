const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { email, password, displayName } = req.body;
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ email, password, displayName });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, email: user.email, displayName: user.displayName } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login Route (Simplified: Accepts any credentials)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find existing user or create a temporary one for this session
        let user = await User.findOne({ email });
        if (!user) {
            // Create a dummy user object for the response
            user = { _id: 'dummy_id', email, displayName: email.split('@')[0] };
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, email: user.email, displayName: user.displayName } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
