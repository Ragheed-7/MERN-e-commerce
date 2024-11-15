const express = require('express');
const User = require('../models/User'); // Correct import for the User model

const router = express.Router();

// Create a new user
router.post('/create', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = new User({
            name,
            email,
            password,
        });

        // Save the new user to the database
        await user.save();

        res.status(201).json({
            errors: null,
            message: 'User created successfully!',
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

// Update a user by ID
router.put('/update/:id', async (req, res) => {
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
router.delete('/delete/:id', async (req, res) => {
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
