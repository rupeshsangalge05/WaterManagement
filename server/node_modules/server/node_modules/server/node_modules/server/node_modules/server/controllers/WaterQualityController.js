import WaterQuality from '../models/WaterQuality.js';
import WaterSource from '../models/WaterSource.js';

export const updateMonthlyWaterQuality = async (req, res) => {
    try {
        const { sourceId, temperature, turbidity, pH, latitude, longitude, month, year } = req.body;

        if (!sourceId || !month || !year) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Optional: ensure source exists
        const source = await WaterSource.findById(sourceId);
        if (!source) {
            return res.status(404).json({ message: "Water source not found" });
        }

        const data = { source: sourceId, temperature, turbidity, pH, location: { latitude, longitude }, month, year };

        const updated = await WaterQuality.findOneAndUpdate(
            { source: sourceId, month, year },
            data,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            message: "Monthly water quality updated successfully",
            waterQuality: updated
        });

    } catch (error) {
        console.error("Error updating water quality:", error);
        res.status(500).json({ message: "Server error" });
    }
};
