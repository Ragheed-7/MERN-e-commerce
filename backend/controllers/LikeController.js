const express = require('express');
const Like = require('../models/Like'); // Correct import for the Like model

const router = express.Router();

// Create a like
router.post('/create', async (req, res) => {
    const { user, product } = req.body;

    try {
        const like = new Like({
            user,
            product
        });

        await like.save();

        res.status(200).json({
            errors: null,
            message: 'Like was created successfully!',
            data: like,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

// Update a like
router.put('/update/:id', async (req, res) => {
    const { user, product } = req.body;

    try {
        const like = await Like.findByIdAndUpdate(
            req.params.id,
            { user, product },
            { new: true }
        );

        if (!like) {
            return res.status(404).json({
                errors: ['Like not found'],
                message: 'Like update failed!',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'Like updated successfully!',
            data: like,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

// Delete a like
router.delete('/delete/:id', async (req, res) => {
    try {
        const like = await Like.findByIdAndDelete(req.params.id);

        if (!like) {
            return res.status(404).json({
                errors: ['Like not found'],
                message: 'Like delete failed!',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'Like deleted successfully!',
            data: like,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

// Get a like by ID
router.get('/:id', async (req, res) => {
    try {
        const like = await Like.findById(req.params.id);

        if (!like) {
            return res.status(404).json({
                errors: ['Like not found'],
                message: 'Like not found!',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'Like found!',
            data: like,
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
