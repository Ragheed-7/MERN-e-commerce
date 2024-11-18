const express = require('express');
const User = require('../models/User'); // Correct import for the User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middlewares/authMiddleware');
const signToken = require('../utils/signToken');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const router = express.Router();

// Create a new user
router.post('/create', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the password meets the criteria
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            errors: ['Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'],
            message: 'Password validation failed.',
            data: null,
        });
    }

    try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with the hashed password
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await user.save();
        const token = signToken(user._id);
        res.status(201).json({
            errors: null,
            message: 'User created successfully!',
            data: {user,token}
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                errors: ['User not found.'],
                message: 'Invalid credentials.',
                data: null,
            });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                errors: ['Invalid password.'],
                message: 'Invalid credentials.',
                data: null,
            });
        }

        // Generate a JWT token if credentials are correct
        const token = signToken(user._id);

        // Return the token in the response
        res.status(200).json({
            errors: null,
            message: 'Login successful.',
            data: { token },
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});


// Update a user by ID
router.put('/update/:id',authMiddleware, async (req, res) => {
    const { id } = req.params; // Get the user ID from the URL
    const { name, email, password } = req.body; // Get updated user data from the body

    try {
        // Find and update the user
        const user = await User.findByIdAndUpdate(
            id,
            { name, email, password },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                errors: ['User not found'],
                message: 'No user found with the provided ID',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'User updated successfully!',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

// Delete a user by ID
router.delete('/delete/:id',authMiddleware,  async (req, res) => {
    const { id } = req.params; // Get the user ID from the URL

    try {
        // Find and delete the user by ID
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                errors: ['User not found'],
                message: 'No user found with the provided ID',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'User deleted successfully!',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Get the user ID from the URL

    try {
        // Find the user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                errors: ['User not found'],
                message: 'No user found with the provided ID',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'User fetched successfully!',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});


module.exports = router;
