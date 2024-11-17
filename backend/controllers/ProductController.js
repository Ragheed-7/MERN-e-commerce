const express = require('express');
const Product = require('../models/Product');  // Correct import, without destructuring
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new product
router.post('/create', authMiddleware ,async (req, res) => {
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
router.put('/update/:id',authMiddleware,  async (req, res) => {
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

//pagination for 3 products search
router.get('/search/value',authMiddleware, async (req, res) => {
    try {
      // Extract query parameters
      const { page = 1, limit = 3, value = '' } = req.query;
      
      // Convert page and limit to integers
      const pageNumber = parseInt(page, 10);
      const pageLimit = parseInt(limit, 10);
  
      // Validate page and limit
      if (pageNumber < 1 || pageLimit < 1) {
        return res.status(400).json({ message: 'Page and limit must be greater than 0.' });
      }
  
      // Calculate skip value (offset for pagination)
      const skip = (pageNumber - 1) * pageLimit;
  
      // Perform the product search query (using regular expression for flexible search)
      const productsQuery = {
        name: { $regex: value, $options: 'i' }, // Case-insensitive search on name
      };
  
      // Fetch products with pagination
      const products = await Product.find(productsQuery)
        .skip(skip)
        .limit(pageLimit)
        .sort({ created_at: -1 }); // Sort by creation date (optional)
  
      // Calculate total products matching the search query
      const totalProducts = await Product.countDocuments(productsQuery);
  
      // Calculate total pages for pagination
      const totalPages = Math.ceil(totalProducts / pageLimit);
  
      // Return the products and pagination info
      res.status(200).json({
        products,
        pagination: {
          currentPage: pageNumber,
          totalProducts,
          pageSize: pageLimit,
        },
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  


module.exports = router;
