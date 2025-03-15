// Import AWS SDK's S3 client and PutObjectCommand
const { s3Client } = require('../config/s3');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto'); // To generate unique file names
const mime = require('mime-types'); // For detecting file MIME types

/**
 * Uploads an image to AWS S3.
 * @param {Buffer} fileBuffer - The image file buffer.
 * @param {string} originalName - The original filename.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
const uploadImage = async (fileBuffer, originalName, mimeType) => {
    try {
        // Generate a unique filename using a random 16-byte hash
        const fileKey = `uploads/${crypto.randomBytes(16).toString("hex")}-${originalName}`;

        // Set up parameters for S3 upload
        const params = {
            Bucket: process.env.S3_BUCKET_NAME, // The name of the S3 bucket
            Key: fileKey, // The unique key (filename) for the stored image
            Body: fileBuffer, // The actual file data (binary buffer)
            ContentType: mimeType, // The file type (e.g., image/png, image/jpeg)
            ACL: "public-read", // Set access control: 'public-read' allows public access to images
        };

        // Upload the file to S3 using the PutObjectCommand
        await s3Client.send(new PutObjectCommand(params));

        // Construct and return the public URL of the uploaded image
        return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error("Image upload failed");
    }
};

module.exports = {
    uploadImage,
}; 