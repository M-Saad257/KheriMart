import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, phone, address, city, country } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        // Save password without hashing (not secure!)
        const user = new User({
            name,
            email,
            password, // plain-text password
            phone,
            address,
            city,
            country,
            role: 'user',
        });

        await user.save();
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Registration failed:", err);
        res.status(500).json({ error: 'Registration failed', detail: err.message });
    }
});


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            success: true
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error', success: false });
    }
});


export default router;
