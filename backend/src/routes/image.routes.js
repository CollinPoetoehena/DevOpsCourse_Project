const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
// Upload middleware
const upload = require("../middleware/multer");
// Import image service
const { uploadImage } = require("../services/image.service");

// Route to handle image uploads (middleware to upload/read 5 images used after auth middleware)
// The images read with the multer middleware are added in req.files
router.post("/upload-images", auth, upload.array("images", 5), async (req, res) => {
    try {
        // Ensure files were provided in the request
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        // Upload each image to S3 and store the URLs
        const uploadedImageUrls = await Promise.all(
            req.files.map(async (file) => {
                return await uploadImage(file.buffer, file.originalname, file.mimetype);
            })
        );

        // Respond with the list of uploaded image URLs
        res.status(200).json({
            message: "Images uploaded successfully",
            imageUrls: uploadedImageUrls,
        });

    } catch (error) {
        console.error("Image upload failed:", error);
        res.status(500).json({ error: "Failed to upload images. Please try again." });
    }
});

module.exports = router;
