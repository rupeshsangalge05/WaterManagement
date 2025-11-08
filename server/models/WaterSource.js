import mongoose from 'mongoose';

const waterSourceSchema = new mongoose.Schema({
    sourceName: { type: String, required: true },
    sourceAddress: { type: String, required: true },
    capacity: { type: String, required: true },
    storage: { type: String, required: true },
    photos: [{
        photoType: { type: String, enum: ['picOne', 'picTwo'], required: true },
        filename: { type: String, required: true },
        path: { type: String, required: true },
        mimetype: { type: String, required: true },
        size: { type: Number, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("WaterSource", waterSourceSchema);