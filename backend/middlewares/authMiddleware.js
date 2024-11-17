const jwt = require('jsonwebtoken');

// Authorization middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Add the decoded payload to the request object
        next(); // Pass control to the next middleware
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;