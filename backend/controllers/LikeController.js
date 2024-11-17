const express = require('express');
const Like = require('../models/Like'); // Correct import for the Like model
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a like
router.post('/create',authMiddleware,  async (req, res) => {
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
router.put('/update/:id',authMiddleware,  async (req, res) => {
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
router.delete('/delete/:id',authMiddleware,  async (req, res) => {
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

router.get('/user/:userId',authMiddleware,  async (req, res) => {
    try {
      const userId = req.params.userId; // Extract userId from route params
      const page = parseInt(req.query.page) || 1; // Default page is 1
      const limit = parseInt(req.query.limit) || 3; // Default limit is 3 items per page
  
      if (page < 1 || limit < 1) {
        return res.status(400).json({ message: 'Page and limit must be greater than 0.' });
      }
  
      const skip = (page - 1) * limit; // Calculate the offset
  
      // Convert userId to ObjectId
      const userIdObject = new mongoose.Types.ObjectId(userId);
  
      // Fetch likes for the user with pagination
      const likes = await Like.find({ user: userIdObject })  // Use 'user' instead of 'userId'
        .sort({ created_at: -1 }) // Sort by latest likes
        .skip(skip) // Skip previous pages
        .limit(limit); // Limit to current page size
  
      const totalLikes = await Like.countDocuments({ user: userIdObject }); // Total number of likes by the user
  
      res.status(200).json({
        likes,
        pagination: {
          currentPage: page,
          totalLikes,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

module.exports = router;
