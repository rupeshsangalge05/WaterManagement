import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Domestic, Commercial, etc.
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  appliedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  rejectedReason: { type: String },
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  bills: [{
    billNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['PENDING', 'PAID', 'OVERDUE'], default: 'PENDING' },
    paymentDate: { type: Date }
  }]
});

const billSchema = new mongoose.Schema({
  units: { type: Number, required: true },
  ratePerUnit: { type: Number, default: 10 },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'PAID', 'OVERDUE'], default: 'PENDING' },
  generatedAt: { type: Date, default: Date.now },
  billNumber: { type: String, },
  billingMonth: { type: Number, min: 1, max: 12 },
  billingYear: { type: Number, },
});

const complaintSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: String,
  email: String,
  subject: String,
  message: String,
  photo: { type: String, default: null },
  video: { type: String, default: null },
  adminResponse: { type: String, default: "No Response" },
  status: { type: String, enum: ['Pending', 'Resolved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  votes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    voteType: { type: String, enum: ['upvote', 'downvote'] }
  }]
});

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  gender: { type: String, required: true },
  wardNo: { type: String, required: true },
  houseNo: { type: String, required: true },
  street: { type: String, required: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'User' },

  // Connection Status (for general status)
  connectionStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },

  // Connection details and history
  connections: [connectionSchema],

  connectionApprovalDate: { type: Date },
  connectionHistory: [{
    status: { type: String, enum: ['APPROVED', 'REJECTED'] },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    changedAt: { type: Date, default: Date.now },
    comment: String
  }],

  rejectionReason: String,

  // Payment
  paymentHistory: [{
    billNumber: { type: Number },
    amount: { type: Number },
    units: { type: Number },
    dueDate: { type: Date },
    ratePerUnit: { type: Number },
    billingMonth: { type: Number },
    billingYear: { type: Number },
    status: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: String,
    transactionId: String
  }],

  // Bills
  bills: [billSchema],

  complaints: [complaintSchema]

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;



