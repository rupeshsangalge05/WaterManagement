import express from 'express';
import { getConnectionsByStatus, approveConnection, rejectConnection, generateBillForUser, getUserBills, getUserPayments, getAllComplaints, respondToComplaint, getContacts, getEmployeesByStatus, approveEmployee, rejectEmployee } from '../controllers/AdminController.js';

const AdminRouter = express.Router();

AdminRouter.get('/user/:status', getConnectionsByStatus);
AdminRouter.patch('/user/approve/:id', approveConnection);
AdminRouter.patch('/user/reject/:id', rejectConnection);
AdminRouter.post('/user/:userId/generateBill', generateBillForUser)
AdminRouter.get('/user/:userId/bill', getUserBills);
AdminRouter.get('/payments/:userId', getUserPayments);
AdminRouter.get('/complaints', getAllComplaints);
AdminRouter.put('/complaints/:complaintId/respond', respondToComplaint);
AdminRouter.get('/contacts', getContacts);
AdminRouter.get('/employee/:status', getEmployeesByStatus);
AdminRouter.patch('/employee/approve/:id', approveEmployee);
AdminRouter.patch('/employee/reject/:id', rejectEmployee);


export default AdminRouter;