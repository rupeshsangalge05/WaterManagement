import express from "express";
import { deleteEmployee, employeeChangePassword, employeeForgotPassword, employeeResetPassword, getAllEmployees, getAllUsers, getEmployeesById, getSingleUser, registerEmployee, updateEmployee } from "../controllers/EmployeeController.js";

const EmployeeRouter = express.Router();

EmployeeRouter.post("/register", registerEmployee);
EmployeeRouter.get("/", getAllEmployees);
EmployeeRouter.put('/changePassword', employeeChangePassword);
EmployeeRouter.post('/forgotPassword', employeeForgotPassword);
EmployeeRouter.post('/resetPassword', employeeResetPassword);
EmployeeRouter.get('/viewUsers', getAllUsers);
EmployeeRouter.get("/:id", getEmployeesById);
EmployeeRouter.put("/:id", updateEmployee);
EmployeeRouter.delete("/:id", deleteEmployee);
EmployeeRouter.get('/viewUser/:id', getSingleUser);


export default EmployeeRouter;
