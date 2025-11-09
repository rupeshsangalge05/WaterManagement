import express from "express";
import { addWaterSource, getAllWaterSources, getWaterSource, deleteWaterSource, updateWaterSource } from "../controllers/WaterSourceController.js";
import multer from "multer";

const WaterSourceRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/water-sources/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
WaterSourceRouter.post("/", upload.array('photos', 2), addWaterSource);
WaterSourceRouter.get("/", getAllWaterSources);
WaterSourceRouter.get("/:id", getWaterSource);
WaterSourceRouter.put('/:id', upload.array('photos'), updateWaterSource);
WaterSourceRouter.delete("/:id", deleteWaterSource);

export default WaterSourceRouter;