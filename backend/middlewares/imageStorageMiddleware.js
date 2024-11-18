const multer = require('multer');
const path = require('path');
const sharp = require('sharp'); // Optional, for image processing

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images'); // Specify upload directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

// File filter to validate image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'), false);
    }
};

// Multer setup
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Middleware function to handle uploads and optional processing
const ImageStorageMiddleware = (req, res, next) => {
    const uploadSingle = upload.single('image'); // Expect a single file with the key 'image'

    uploadSingle(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        // Optional: Resize image using sharp
        if (req.file) {
            const outputPath = `uploads/images/resized-${req.file.filename}`;
            try {
                await sharp(req.file.path)
                    .resize({ width: 800 }) // Resize to 800px width, keeping aspect ratio
                    .toFile(outputPath);

                req.file.resizedPath = outputPath; // Add resized path info to req.file
            } catch (sharpError) {
                return res.status(500).json({ error: 'Error processing image' });
            }
        }

        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = ImageStorageMiddleware;
