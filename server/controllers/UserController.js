import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'

dotenv.config();
const userResetTokens = new Map();

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, address, gender, contact, wardNo, houseNo, street, password } = req.body;

    if (!fullName || !email || !address || !gender || !contact || !password || !wardNo || !houseNo || !street) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, address, gender, contact, password: hashedPassword, wardNo, houseNo, street, role:"User"});

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering the user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


export const extractUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token missing or malformed');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};


export const getMyProfile = async (req, res) => {
  try {
    const user = await extractUserFromToken(req);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};


export const getMyBills = async (req, res) => {
  try {
    const user = await extractUserFromToken(req);
    res.status(200).json(user.bills || []);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};


export const getMyConnections = async (req, res) => {
  try {
    const user = await extractUserFromToken(req);
    res.status(200).json(user.connections || []);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};


export const getMyConnectionHistory = async (req, res) => {
  try {
    const user = await extractUserFromToken(req);
    res.status(200).json(user.connectionHistory || []);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};


export const getMyPayments = async (req, res) => {
  try {
    const user = await extractUserFromToken(req);
    res.status(200).json(user.paymentHistory || []);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};


export const payBill = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { billId, transactionId, paymentMethod } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const billIndex = user.bills.findIndex(b => b._id.toString() === billId);
    if (billIndex === -1) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const bill = user.bills[billIndex];
    if (bill.status === 'PAID') {
      return res.status(400).json({ message: "Bill already paid" });
    }

    const paidDate = new Date();
    user.bills[billIndex].status = 'PAID';
    user.bills[billIndex].paymentDate = paidDate;

    user.paymentHistory.push({
      amount: bill.amount,
      paymentDate: paidDate,
      paymentMethod,
      transactionId,
      status: 'PAID',
      billNumber: bill.billNumber,
      units: bill.units,
      ratePerUnit: bill.ratePerUnit,
      dueDate: bill.dueDate,
      billingMonth: bill.billingMonth,
      billingYear: bill.billingYear
    });

    const allPaid = user.bills.every(b => b.status === 'PAID');
    user.paymentStatus = allPaid ? 'PAID' : 'PENDING';

    user.markModified('bills');
    user.markModified('paymentHistory');

    await user.save();

    res.status(200).json({
      message: "Payment successful",
      paidBill: user.bills[billIndex],
      paymentStatus: user.paymentStatus,
      paymentHistory: user.paymentHistory
    });
  } catch (error) {
    console.error("payBill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const changePassword = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { currentPassword, newPassword } = req.body;

    // Check old password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect current password" });

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

import { randomBytes } from 'crypto';

export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const data = userResetTokens.get(resetToken);

  if (!data || data.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Token invalid or expired." });
  }

  const user = await User.findOne({ email: data.email });
  if (!user) return res.status(404).json({ message: "User not found." });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  userResetTokens.delete(resetToken);

  res.status(200).json({ message: "Password has been reset." });
};


export const createUserComplaint = async (req, res) => {
  try {
    const { email, name, subject, message } = req.body;

    const photo = req.files?.photo?.[0]?.filename || null;
    const video = req.files?.video?.[0]?.filename || null;

    // 1. Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Push the complaint into the user's complaint array
    const newComplaint = { name, email, subject, message, photo, video, createdAt: new Date() };

    user.complaints.push(newComplaint);

    // 3. Save the updated user
    await user.save();

    res.status(201).json({ message: 'Complaint submitted successfully', complaint: newComplaint });
  } catch (error) {
    console.error('Complaint submission error:', error);
    res.status(500).json({ message: 'Failed to submit complaint' });
  }
};


export const getAllComplaintsForAdmin = async (req, res) => {
  try {
    const users = await User.find({}, 'fullName email complaints');

    const complaints = users.flatMap(user =>
      user.complaints.map(comp => ({
        ...comp.toObject(),
        fullName: user.fullName,
        email: user.email
      }))
    );

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
};


export const getAllComplaintsForUser = async (req, res) => {
  try {
    const user = await extractUserFromToken(req); // ✅ This line is what throws the error if no token
    const userId = user._id;

    const userData = await User.findById(userId).select('fullName email complaints');

    const complaints = userData.complaints.map(comp => ({
      ...comp.toObject(),
      fullName: userData.fullName,
      email: userData.email
    }));

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error fetching complaints' });
  }
};


export const getAllComplaintsForGuest = async (req, res) => {
  try {

    const userData = await User.findById(User._id).select('fullName email complaints');

    const complaints = userData.complaints.map(comp => ({
      ...comp.toObject(),
      fullName: userData.fullName,
      email: userData.email
    }));

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error fetching complaints' });
  }
};


import fs from 'fs'

export const updateComplaint = async (req, res) => {
  try {
    const user = await extractUserFromToken(req);
    const userId = user._id;
    const complaintId = req.params.id;

    const { name, email, subject, message } = req.body;

    const userDoc = await User.findById(userId);
    if (!userDoc) return res.status(404).json({ message: 'User not found' });

    const complaint = userDoc.complaints.id(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Update fields
    complaint.name = name || complaint.name;
    complaint.email = email || complaint.email;
    complaint.subject = subject || complaint.subject;
    complaint.message = message || complaint.message;

    // Handle files (if applicable)
    if (req.files?.photo) {
      if (complaint.photo) {
        fs.unlink(`uploads/complaints/${complaint.photo}`, err => {
          if (err) console.error('Error deleting old photo:', err);
        });
      }
      complaint.photo = req.files.photo[0].filename;
    }

    if (req.files?.video) {
      if (complaint.video) {
        fs.unlink(`uploads/complaints/${complaint.video}`, err => {
          if (err) console.error('Error deleting old video:', err);
        });
      }
      complaint.video = req.files.video[0].filename;
    }

    await userDoc.save();
    res.json({ message: 'Complaint updated successfully', complaint });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error updating complaint' });
  }
};



export const deleteComplaint = async (req, res) => {
  try {
    const user = await extractUserFromToken(req);
    const userId = user._id;
    const complaintId = req.params.id;

    const userDoc = await User.findById(userId);
    if (!userDoc) return res.status(404).json({ message: 'User not found' });

    const complaint = userDoc.complaints.id(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Delete associated files
    if (complaint.photo) {
      fs.unlink(`uploads/complaints/${complaint.photo}`, err => {
        if (err) console.error('Error deleting photo:', err);
      });
    }

    if (complaint.video) {
      fs.unlink(`uploads/complaints/${complaint.video}`, err => {
        if (err) console.error('Error deleting video:', err);
      });
    }

    complaint.deleteOne(); // or complaint.remove() if you're using Mongoose <6
    await userDoc.save();

    res.json({ message: 'Complaint deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error deleting complaint' });
  }
};



export const voteOnComplaint = async (req, res) => {
  try {
    // ✅ 1) Extract user from token
    const user = await extractUserFromToken(req);
    const voterId = user._id.toString();

    // ✅ 2) Params & body
    const { complaintId } = req.params;
    const { voteType } = req.body;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    // ✅ 3) Find user who owns this complaint
    const owner = await User.findOne({ 'complaints._id': complaintId });
    if (!owner) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const complaint = owner.complaints.id(complaintId);

    // ✅ 4) Remove any existing vote by this user
    complaint.votes = complaint.votes.filter(v => v.userId.toString() !== voterId);

    // ✅ 5) Add the new vote
    complaint.votes.push({ userId: voterId, voteType });

    // ✅ 6) Save
    await owner.save();

    res.json({
      message: 'Your vote has been recorded',
      votes: complaint.votes.length,
    });
  } catch (err) {
    console.error('Vote Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


import nodemailer from 'nodemailer'

export const forgotPassword = async (req, res) => {
  try {
      const { email } = req.params;  // Assuming the email is passed in the body (correcting from req.params)

      const user = await User.findOne({ email });  // Searching the user by email

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Generate a temporary password
      const randomNumber = Math.floor(10000 + Math.random() * 90000).toString();

      // Hash the temporary password before saving it to the database
      const hashedPassword = await bcrypt.hash(randomNumber, 10);

      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();  // Ensure the save operation is awaited

      // Send the email with the temporary password
      await sendForgotPasswordEmail(user, randomNumber);  // Wait until the email is sent

      // Return success message after the email is sent
      return res.status(200).json({ message: "Temporary password sent to email" });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
  }
}


const sendForgotPasswordEmail = async (user, password) => {
  try {
      // Create a transporter for the email
      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL_ID,
              pass: process.env.EMAIL_PASSWORD,
          },
      });

      const mailOptions = {
          from: process.env.EMAIL_ID, // Sender's email address
          to: user.email, // Receiver's email address
          subject: 'Temporary Password for Account Access', // Email subject
          html: `<p>Hello ${user.firstName},</p>
                 <p>Below is the temporary password to login. Please change it after logging in:</p>
                 <br><br>
                 <h3>${password}</h3> 
                 <br><br>
                 <p>Best regards,<br>Your Company Name</p>`, // HTML email content
      };

      // Send the email and return the result
      return new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.error('Error sending email:', error);
                  reject(new Error('Failed to send the email'));
              } else {
                  console.log('Email sent:', info.response);
                  resolve(info);
              }
          });
      });
  } catch (error) {
      console.error('Error in email function:', error);
      throw new Error(error.message);  // Throw error to be caught in forgotPassword
  }
}
