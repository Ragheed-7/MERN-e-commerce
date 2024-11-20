const express = require('express');
const Product = require('../models/Product');  // Correct import, without destructuring
const authMiddleware = require('../middlewares/authMiddleware');
const  ImageUpload  = require('../middlewares/imageStorageMiddleware');

const router = express.Router();

// Create a new product
router.post('/create',  ImageUpload.array('pictures', 5) ,async (req, res) => {
    try {
    const { name, description, price,  category} = req.body;
    const pictures = req.files.map((file) => file.path)


        if (
            !name ||
            !description ||
            !price ||
            !pictures.length ||
            !category
        ) {
            throw new Error("At least one of the required fields is empty")
        }

        const product = new Product({
            name,
            description,
            price,
            pictures,
            category
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

// searching by price
router.get('/search/price',authMiddleware, async (req, res) => {
    try {
        // Extract price range from query parameters
        const { price_min = 0, price_max = 1000000 } = req.query;

        // Convert price_min and price_max to numbers
        const minPrice = parseFloat(price_min);
        const maxPrice = parseFloat(price_max);

        // Ensure the price range is valid
        if (isNaN(minPrice) || isNaN(maxPrice)) {
            return res.status(400).json({
                message: 'Invalid price range. Please provide valid numerical values for price_min and price_max.',
            });
        }

        // Fetch products within the price range
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }, // Filtering by price range
        });

        // Check if products were found
        if (products.length === 0) {
            return res.status(404).json({
                message: 'No products found within the specified price range.',
                data: null,
            });
        }

        // Return the products in the response
        res.status(200).json({
            message: 'Products fetched successfully!',
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message: 'Something went wrong. Please try again later.',
            error: error.message,
        });
    }
});

router.get('/display/latest', async (req,res)=>{
    try {
        const products = await Product.find().sort({ createdAt: -1 }).limit(20);
        res.status(200).json({
          success: true,
          products,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch products",
          error: error.message,
        });
      }
})
  


module.exports = router;
