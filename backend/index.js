const express = require('express');
const connectDB = require('./database');
const dotenv = require('dotenv');
const UserController = require('./controllers/UserController'); 
const ProductController = require('./controllers/ProductController'); 
const ReviewController = require('./controllers/ReviewController'); 
const LikeController = require('./controllers/LikeController'); 
const CartController = require('./controllers/CartController'); 
const OrderController = require('./controllers/OrderController'); 
const path = require('path')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
// Connect to MongoDB
connectDB();

app.use('/images', express.static(path.join(__dirname, 'images')))

const prefix = '/api';
const version = '/v1';

app.use(prefix + version + '/user', UserController); 
app.use(prefix + version + '/product', ProductController); 
app.use(prefix + version + '/review', ReviewController); 
app.use(prefix + version + '/like', LikeController); 
app.use(prefix + version + '/cart', CartController); 
app.use(prefix + version + '/order', OrderController); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
