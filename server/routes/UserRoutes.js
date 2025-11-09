import express from 'express';
import { getMyProfile, getMyBills, getMyConnections, getMyConnectionHistory, getMyPayments, payBill, changePassword, 
  forgotPassword, registerUser, createUserComplaint,  voteOnComplaint,
  getAllComplaintsForAdmin, getAllComplaintsForUser, updateComplaint, deleteComplaint } from '../controllers/UserController.js';

const UserRouter = express.Router();

UserRouter.post('/register', registerUser);
UserRouter.get('/profile', getMyProfile);
UserRouter.get('/bills', getMyBills);
UserRouter.get('/connections', getMyConnections);
UserRouter.get('/connectionHistory', getMyConnectionHistory);
UserRouter.get('/payments', getMyPayments);
UserRouter.post('/pay', payBill);
UserRouter.put('/changePassword', changePassword);
// UserRouter.post('/forgotPassword', forgotPassword);
UserRouter.put('/forgotPassword/:email', forgotPassword);

import multer from 'multer';
import path from 'path';

const complaintStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(), 'uploads', 'complaints'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const complaintUpload = multer({ storage: complaintStorage });

UserRouter.post('/complaint', complaintUpload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createUserComplaint);
UserRouter.get('/complaintForAdmin',  getAllComplaintsForAdmin);
UserRouter.get('/complaintForUser',  getAllComplaintsForUser);
UserRouter.put('/complaint/:id', complaintUpload.fields([{ name: 'photo' }, { name: 'video' }]), updateComplaint);
UserRouter.delete('/complaint/:id', deleteComplaint);
UserRouter.post('/complaint/:complaintId/vote', voteOnComplaint);


export default UserRouter;
