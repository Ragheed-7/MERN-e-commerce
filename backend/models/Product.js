const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    pictures: {
        type: [String],
        required: true,
    },
    category: {
        enum: ['cars', 'pets', 'devices'],
        type: String,
        required: true,
    },
    number_of_reviews: {
        type: Number,
        required: true,
    },
    sum_of_ratings: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

// Correct export of Product model
module.exports = mongoose.model('Product', ProductSchema);
