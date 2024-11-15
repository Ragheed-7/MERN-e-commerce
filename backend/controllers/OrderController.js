const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');  // Import Product model to check product details
const router = express.Router();

// Create an order
router.post('/create', async (req, res) => {
    const { user, products, delivery_address, payment_method } = req.body;

    try {
        if (!products || products.length === 0) {
            return res.status(400).json({
                errors: ['Products array is required and cannot be empty'],
                message: 'Order creation failed!',
                data: null
            });
        }

        // Calculate the total price of the order
        let total_price = 0;

        for (let item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    errors: [`Product with ID ${item.product} not found`],
                    message: 'Order creation failed!',
                    data: null
                });
            }

            total_price += item.quantity * product.price;
        }

        const order = new Order({
            user,
            products,
            total_price,
            delivery_address,
            payment_method
        });

        await order.save();

        res.status(201).json({
            errors: null,
            message: 'Order created successfully!',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null
        });
    }
});

// Update an order
router.put('/update/:id', async (req, res) => {
    const { products, status, delivery_address, payment_method } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                errors: ['Order not found'],
                message: 'Order update failed!',
                data: null
            });
        }

        // Validate products and calculate total price
        let total_price = 0;

        for (let item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    errors: [`Product with ID ${item.product} not found`],
                    message: 'Order update failed!',
                    data: null
                });
            }

            total_price += item.quantity * product.price;
        }

        // Update the order fields
        order.products = products;
        order.status = status || order.status;  // Keep the existing status if no new one is provided
        order.delivery_address = delivery_address || order.delivery_address;
        order.payment_method = payment_method || order.payment_method;
        order.total_price = total_price;

        await order.save();

        res.status(200).json({
            errors: null,
            message: 'Order updated successfully!',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null
        });
    }
});

// Delete an order
router.delete('/delete/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                errors: ['Order not found'],
                message: 'Order deletion failed!',
                data: null
            });
        }

        res.status(200).json({
            errors: null,
            message: 'Order deleted successfully!',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            errors: [error.message || 'Internal server error'],
            message: 'Something went wrong!',
            data: null
        });
    }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products.product');

        if (!order) {
            return res.status(404).json({
                errors: ['Order not found'],
                message: 'Order retrieval failed!',
                data: null
            });
        }

        res.status(200).json({
            errors: null,
            message: 'Order retrieved successfully!',
            data: order
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
