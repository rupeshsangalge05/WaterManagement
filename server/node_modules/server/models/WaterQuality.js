import mongoose from 'mongoose';

const waterQualitySchema = new mongoose.Schema({
    source: { type: mongoose.Schema.Types.ObjectId, ref: 'WaterSource', required: true },
    temperature: { type: Number, required: true },
    turbidity: { type: Number, required: true },
    pH: { type: Number, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    month: { type: Number, required: true }, // 1 to 12
    year: { type: Number, required: true },
    recordedAt: { type: Date, default: Date.now }
});

waterQualitySchema.index({ source: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model("WaterQuality", waterQualitySchema);
