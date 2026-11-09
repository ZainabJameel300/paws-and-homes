const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        cb(null, file.mimetype.startsWith("image/"));
    }
});

module.exports = upload;