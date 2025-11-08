import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "Admin" }  
}, { timestamps: true });

export default mongoose.model("Admin", AdminSchema);
