const jwt = require('jsonwebtoken');

// Function to sign a JWT
const signToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

module.exports = signToken;
