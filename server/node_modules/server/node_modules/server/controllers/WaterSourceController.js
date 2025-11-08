import WaterSource from "../models/WaterSource.js";
import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';

// Helper function to ensure upload directory exists
const ensureUploadsDir = () => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'water-sources');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
};

// Add new water source
export const addWaterSource = async (req, res) => {
    try {
        ensureUploadsDir();
        const { sourceName, sourceAddress, capacity, storage } = req.body;
        const files = req.files;
        const photoTypes = JSON.parse(req.body.photoTypes);

        // Validate required fields
        if (!sourceName || !sourceAddress || !capacity || !storage) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate photos
        if (!files || files.length !== 2 || !photoTypes || photoTypes.length !== 2) {
            return res.status(400).json({ message: "Exactly two photos are required" });
        }

        // Process files
        const photos = files.map((file, index) => {
            return {
                photoType: photoTypes[index],
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            };
        });

        // Create new water source
        const newWaterSource = new WaterSource({
            sourceName,
            sourceAddress,
            capacity,
            storage,
            photos
        });

        await newWaterSource.save();

        res.status(201).json({
            message: "Water source added successfully",
            waterSource: newWaterSource
        });

    } catch (error) {
        console.error("Error adding water source:", error);
        
        // Cleanup uploaded files if error occurs
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                fs.unlink(file.path, err => {
                    if (err) console.error("Error deleting file:", err);
                });
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error" });
    }
};

// Get all water sources
export const getAllWaterSources = async (req, res) => {
    try {
        const waterSources = await WaterSource.find().sort({ createdAt: -1 });
        res.status(200).json(waterSources);
    } catch (error) {
        console.error("Error fetching water sources:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get single water source
export const getWaterSource = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const waterSource = await WaterSource.findById(id);
        
        if (!waterSource) {
            return res.status(404).json({ message: "Water source not found" });
        }

        res.status(200).json(waterSource);
    } catch (error) {
        console.error("Error fetching water source:", error);
        res.status(500).json({ message: "Server error" });
    }
};



export const updateWaterSource = async (req, res) => {
    try {
        ensureUploadsDir();

        const { id } = req.params;
        const { sourceName, sourceAddress, capacity, storage } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const waterSource = await WaterSource.findById(id);
        if (!waterSource) {
            return res.status(404).json({ message: "Water source not found" });
        }

        // Update fields only if provided
        if (sourceName) waterSource.sourceName = sourceName;
        if (sourceAddress) waterSource.sourceAddress = sourceAddress;
        if (capacity) waterSource.capacity = capacity;
        if (storage) waterSource.storage = storage;

        // Handle photo updates if new files uploaded
        if (req.files && req.files.length > 0) {
            const photoTypes = JSON.parse(req.body.photoTypes || '[]');

            if (req.files.length !== 2 || photoTypes.length !== 2) {
                return res.status(400).json({ message: "Exactly two photos and types are required" });
            }

            // Remove old photos
            if (waterSource.photos && waterSource.photos.length > 0) {
                waterSource.photos.forEach(photo => {
                    fs.unlink(photo.path, err => {
                        if (err) console.error("Error deleting old file:", err);
                    });
                });
            }

            // Add new photos
            const newPhotos = req.files.map((file, index) => ({
                photoType: photoTypes[index],
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            }));

            waterSource.photos = newPhotos;
        }

        await waterSource.save();

        res.status(200).json({
            message: "Water source updated successfully",
            waterSource
        });
    } catch (error) {
        console.error("Error updating water source:", error);

        // Cleanup newly uploaded files if any error occurs
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                fs.unlink(file.path, err => {
                    if (err) console.error("Error deleting file:", err);
                });
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};


export const deleteWaterSource = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const waterSource = await WaterSource.findByIdAndDelete(id);
        
        if (!waterSource) {
            return res.status(404).json({ message: "Water source not found" });
        }

        // Delete associated files
        waterSource.photos.forEach(photo => {
            fs.unlink(photo.path, err => {
                if (err) console.error("Error deleting file:", err);
            });
        });

        res.status(200).json({ message: "Water source deleted successfully" });
    } catch (error) {
        console.error("Error deleting water source:", error);
        res.status(500).json({ message: "Server error" });
    }
};