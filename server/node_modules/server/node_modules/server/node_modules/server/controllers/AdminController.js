import Contact from '../models/Contact.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Get connections by status
export const getConnectionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const connections = await User.find({ connectionStatus: status }).select(
      'fullName email address contact connectionStatus rejectionReason createdAt'
    );
    res.status(200).json(connections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const approveConnection = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid connection ID' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        connectionStatus: 'APPROVED',
        rejectionReason: null,
        $push: {
          connectionHistory: {
            status: 'APPROVED',
            changedAt: new Date(),
          },
        },
      },
      { new: true }
    ).select('fullName email connectionStatus');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    res.status(200).json({
      message: 'Connection approved successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const rejectConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid connection ID' });
    }
    if (!reason || typeof reason !== 'string') {
      return res.status(400).json({ message: 'Valid rejection reason required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        connectionStatus: 'REJECTED',
        rejectionReason: reason,
        $push: {
          connectionHistory: {
            status: 'REJECTED',
            changedAt: new Date(),
            comment: reason,
          },
        },
      },
      { new: true }
    ).select('fullName email connectionStatus rejectionReason');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    res.status(200).json({
      message: 'Connection rejected successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const generateBillForUser = async (req, res) => {
  const { userId } = req.params;
  const { units, dueDate } = req.body;
  const ratePerUnit = 10;
  const amount = units * ratePerUnit;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newBill = {
      units,
      ratePerUnit,
      amount,
      dueDate,
      status: 'PENDING',
      generatedAt: new Date(),
    };

    // Log the data to ensure it's correct
    console.log("Generated bill data:", newBill);

    user.bills.push(newBill);
    await user.save();

    res.status(200).json({ message: 'Bill generated successfully', bill: newBill });
  } catch (error) {
    // Detailed error logging
    console.error("Error generating bill:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getUserBills = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // stops here
    }
    return res.status(200).json(user.bills); // stops here
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' }); // also stops here
  }
};



export const getUserPayments = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('paymentHistory fullName email contact');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      contact: user.contact,
      paymentHistory: user.paymentHistory || [],
    }, user.paymentHistory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Employee from '../models/Employee.js';

dotenv.config();

export const getAllComplaints = async (req, res) => {
  try {
    // 🔐 Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // ✅ Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const role = decoded.role;

    // If role is 'Admin', return all complaints from all users
    if (role === 'Admin') {
      const users = await User.find({}, 'fullName email complaints');
      const complaints = users.flatMap(user =>
        user.complaints.map(c => ({
          ...c.toObject(),
          userId: user._id,
          fullName: user.fullName,
          email: user.email,
        }))
      );

      return res.status(200).json(complaints);
    }

    // Otherwise, return only this user's complaints
    const user = await User.findById(userId, 'fullName email complaints');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const complaints = user.complaints.map(c => ({
      ...c.toObject(),
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
    }));

    res.status(200).json(complaints);
  } catch (error) {
    console.error('getAllComplaints error:', error);
    res.status(500).json({ message: 'Server error or invalid token' });
  }
};



export const respondToComplaint = async (req, res) => {
  const { complaintId } = req.params;
  const { adminResponse, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(complaintId)) {
    return res.status(400).json({ message: 'Invalid complaint ID' });
  }

  try {
    // Find the user who has this complaint
    const user = await User.findOne({ 'complaints._id': complaintId });
    if (!user) {
      return res.status(404).json({ message: 'User with complaint not found' });
    }

    const complaint = user.complaints.id(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.adminResponse = adminResponse;
    complaint.status = status;

    await user.save();

    return res.status(200).json({ message: 'Complaint updated successfully', complaint });
  } catch (error) {
    console.error('Admin Response Error:', error);
    return res.status(500).json({ message: 'Server error while updating complaint' });
  }
};

export const getContacts = async (req, res) => {
  try {
    // const contact = Contact.findOne({ email })
    const contacts = Contact.find().sort({ crearedAt: -1 })
    if (!contacts) res.status(400).json({ message: "Contact not found" })

    // res.status(200).json({contacts})
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}


export const getEmployeesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const employees = await Employee.find({ status }).select(
      "fullName email address contact status adminResponse createdAt"
    );
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const approveEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        status: "APPROVED",
        adminResponse: "",
        $push: {
          statusHistory: {
            status: "APPROVED",
            changedAt: new Date(),
          },
        },
      },
      { new: true }
    ).select("fullName email status");

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee approved successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const rejectEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    if (!reason || typeof reason !== "string") {
      return res.status(400).json({ message: "Valid rejection reason required" });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        status: "REJECTED",
        adminResponse: reason,
        $push: {
          statusHistory: {
            status: "REJECTED",
            changedAt: new Date(),
            comment: reason,
          },
        },
      },
      { new: true }
    ).select("fullName email status adminResponse");

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee rejected successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
