import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from "body-parser";
import path from 'path';
import multer from 'multer';
import fs from 'fs';

import AuthRouter from './routes/AuthRoutes.js';
import AdminRouter from './routes/AdminRoutes.js';
import UserRouter from './routes/UserRoutes.js';
import EmployeeRouter from './routes/EmployeeRoutes.js';
import WaterSourceRouter from './routes/WaterSourceRoutes.js';
import ContactRouter from './routes/ContactRoutes.js'
import WaterTimetableRouter from './routes/WaterTimetableRoutes.js';

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Simple Route
app.get('/', (req, res) => {
  res.send('MERN Stack Server is running!');
});

// Upload Directories Setup
const baseUploadDirectory = path.join(path.resolve(), 'uploads');
const waterSourceUploadDirectory = path.join(baseUploadDirectory, 'water-sources');
const profileUploadDirectory = path.join(baseUploadDirectory, 'profiles');
const complaintUploadDirectory = path.join(baseUploadDirectory, 'complaints');

const ensureDirectoryExists = (dirPath, name) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created ${name} directory: ${dirPath}`);
  }
};

ensureDirectoryExists(baseUploadDirectory, 'Base');
ensureDirectoryExists(waterSourceUploadDirectory, 'Water Sources');
ensureDirectoryExists(profileUploadDirectory, 'Profiles');
ensureDirectoryExists(complaintUploadDirectory, 'Complaints');

// Multer Configs
const profileStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, profileUploadDirectory),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const profileUpload = multer({ storage: profileStorage });

const complaintStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, complaintUploadDirectory),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const complaintUpload = multer({ storage: complaintStorage });

// Serve Static Uploads
app.use('/uploads', express.static(baseUploadDirectory));

// General Upload Endpoint
app.post('/upload', profileUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  const filePath = path.join('uploads', 'profiles', req.file.filename);
  res.status(200).json({ message: 'Uploaded', filePath: filePath.replace(/\\/g, '/') });
});

// File Download Endpoint
app.get('/download/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  let filePath;
  switch (type) {
    case 'profile': filePath = path.join(profileUploadDirectory, filename); break;
    case 'waterSource': filePath = path.join(waterSourceUploadDirectory, filename); break;
    case 'complaint': filePath = path.join(complaintUploadDirectory, filename); break;
    default: return res.status(400).json({ message: 'Invalid file type' });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(404).send('File not found');
    }
  });
});


// Existing Route Mounts
app.use('/admin', AdminRouter);
app.use('/user', UserRouter);
app.use('/employee', EmployeeRouter);
app.use('/auth', AuthRouter);
app.use('/waterSources', WaterSourceRouter);
app.use('/contact', ContactRouter);
app.use('/timetable', WaterTimetableRouter);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

app.listen(5000, '0.0.0.0', () => {
  console.log("Server is running on http://localhost:5000");
});

