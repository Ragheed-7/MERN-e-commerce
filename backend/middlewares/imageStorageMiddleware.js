const multer = require('multer');

const imageStorage = multer.diskStorage({
    destination: 'images/',
    filename: function (req, file, callback) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniquePrefix + '-' + file.originalname);
    }
});

const ImageUpload = multer({ storage: imageStorage });

// Exporting multer instance (ImageUpload) correctly
module.exports = ImageUpload;
