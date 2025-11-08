import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "Employee" },
  
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    adminResponse: {
      type: String,
      default: "Not Response",
    },
    statusHistory: [
      {
      status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"],  default: "PENDING", },
        changedAt: { type: Date, default: Date.now },
        comment: { type: String },
      },
    ]
  }, { timestamps: true });

  export default mongoose.model("Employee", EmployeeSchema);
  