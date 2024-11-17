const express = require('express');
const Review = require('../models/Review'); // Path to the Review model
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a Review (POST /reviews)
router.post('/create',authMiddleware, async (req, res) => {
    const { user, product, rating } = req.body;

    try {
        const review = new Review({ user, product, rating });
        await review.save();
        res.status(200).json({
            errors: null,
            message: 'Review created successfully!',
            data: review
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null
        });
    }
});
// Get a review by ID (GET /reviews/:id)
router.get('/:id',  async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findById(id).populate('user product');
        if (!review) {
            return res.status(404).json({
                errors: ['Review not found'],
                message: 'Review not found!',
                data: null
            });
        }
        res.status(200).json({
            errors: null,
            message: 'Review fetched successfully!',
            data: review
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null
        });
    }
});

// Update a review by ID (PUT /reviews/:id)
router.put('/update/:id',authMiddleware,  async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    try {
        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { rating },
            { new: true }
        );
        if (!updatedReview) {
            return res.status(404).json({
                errors: ['Review not found'],
                message: 'Review not found!',
                data: null
            });
        }
        res.status(200).json({
            errors: null,
            message: 'Review updated successfully!',
            data: updatedReview
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null
        });
    }
});

// Delete a review by ID (DELETE /reviews/:id)
router.delete('/delete/:id',authMiddleware,  async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReview = await Review.findByIdAndDelete(id);
        if (!deletedReview) {
            return res.status(404).json({
                errors: ['Review not found'],
                message: 'Review not found!',
                data: null
            });
        }
        res.status(200).json({
            errors: null,
            message: 'Review deleted successfully!',
            data: deletedReview
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null
        });
    }
});

module.exports = router;
