import mongoose from 'mongoose'

const waterTimetableSchema = new mongoose.Schema({
    day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    morning: { type: String, required: true },
    wardNo: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model("Timetable", waterTimetableSchema);

