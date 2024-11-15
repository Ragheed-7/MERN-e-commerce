const express = require('express');
const Cart = require('../models/Cart'); // Correct import for the Cart model
const Product = require('../models/Product'); 

const router = express.Router();
// Create a cart
router.post('/create', async (req, res) => {
    const { user, items } = req.body;

    try {
        // Ensure items array is valid
        if (!items || items.length === 0) {
            return res.status(400).json({
                errors: ['Items array is required and cannot be empty'],
                message: 'Cart creation failed!',
                data: null,
            });
        }

        // Calculate total price
        let total_price = 0;

        for (let item of items) {
            if (!item.product || !item.quantity || isNaN(item.quantity) || item.quantity < 1) {
                return res.status(400).json({
                    errors: ['Invalid item details'],
                    message: 'Cart creation failed!',
                    data: null,
                });
            }

            // Make sure the product's price exists
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    errors: [`Product with ID ${item.product} not found`],
                    message: 'Cart creation failed!',
                    data: null,
                });
            }

            total_price += item.quantity * product.price;
        }

        const cart = new Cart({
            user,
            items,
            total_price,
        });

        await cart.save();

        res.status(200).json({
            errors: null,
            message: 'Cart was created successfully!',
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

// Update a cart
router.put('/update/:id', async (req, res) => {
    const { items } = req.body;

    try {
        const cart = await Cart.findById(req.params.id);

        if (!cart) {
            return res.status(404).json({
                errors: ['Cart not found'],
                message: 'Cart update failed!',
                data: null,
            });
        }

        // Ensure items array is valid
        if (!items || items.length === 0) {
            return res.status(400).json({
                errors: ['Items array is required and cannot be empty'],
                message: 'Cart update failed!',
                data: null,
            });
        }

        // Recalculate total price
        let total_price = 0;

        for (let item of items) {
            if (!item.product || !item.quantity || isNaN(item.quantity) || item.quantity < 1) {
                return res.status(400).json({
                    errors: ['Invalid item details'],
                    message: 'Cart update failed!',
                    data: null,
                });
            }

            // Ensure the product exists and get its price
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    errors: [`Product with ID ${item.product} not found`],
                    message: 'Cart update failed!',
                    data: null,
                });
            }

            total_price += item.quantity * product.price;
        }

        cart.items = items;
        cart.total_price = total_price;

        await cart.save();

        res.status(200).json({
            errors: null,
            message: 'Cart updated successfully!',
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});


// Delete a cart
router.delete('/delete/:id', async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);

        if (!cart) {
            return res.status(404).json({
                errors: ['Cart not found'],
                message: 'Cart delete failed!',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'Cart deleted successfully!',
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null,
        });
    }
});

// Get a cart by ID
router.get('/:id', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).populate('items.product');

        if (!cart) {
            return res.status(404).json({
                errors: ['Cart not found'],
                message: 'Cart not found!',
                data: null,
            });
        }

        res.status(200).json({
            errors: null,
            message: 'Cart found!',
            data: cart,
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
