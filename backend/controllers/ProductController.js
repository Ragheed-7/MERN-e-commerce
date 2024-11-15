const express = require('express');
const Product = require('../models/Product');  // Correct import, without destructuring

const router = express.Router();

// Create a new product
router.post('/create', async (req, res) => {
    const { name, description, price, pictures, category, number_of_reviews, sum_of_ratings } = req.body;

    try {
        const product = new Product({
            name,
            description,
            price,
            pictures,
            category,
            number_of_reviews,
            sum_of_ratings,
        });

        await product.save();

        res.status(201).json({
            errors: null,
            message: 'Product created successfully!',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

// Update a product by ID
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, pictures, category, number_of_reviews, sum_of_ratings } = req.body;

    try {
        const product = await Product.findByIdAndUpdate(
            id,
            { name, description, price, pictures, category, number_of_reviews, sum_of_ratings },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                errors: ['Product not found'],
                message: 'No product found with the provided ID',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'Product updated successfully!',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

// Delete a product by ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                errors: ['Product not found'],
                message: 'No product found with the provided ID',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'Product deleted successfully!',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                errors: ['Product not found'],
                message: 'No product found with the provided ID',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'Product fetched successfully!',
            data: product,
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
