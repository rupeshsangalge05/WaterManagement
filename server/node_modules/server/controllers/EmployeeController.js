import Employee from '../models/Employee.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerEmployee = async (req, res) => {
  try {
    const { fullName, email, address, gender, contact, password } = req.body;

    if (!fullName || !email || !address || !gender || !contact || !password ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) return res.status(400).json({ message: "Employee already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = new Employee({ fullName, email, address, gender, contact, password: hashedPassword, role:"Employee"});

    await newEmployee.save();
    res.status(201).json({ message: "Employee registered successfully!" });
  } catch (error) {
    console.error("Error registering the employee:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
        res.status(200).json(employees)
    } catch (error) {
        console.error("Error fetching the Employees: ", error)
        res.status(500).json({ message: error.message })
    }
}


export const getEmployeesById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params._id)
        if (!employee) return res.status(404).json({ message: "Employee not found" })
        res.status(200).json(employee)
    } catch (error) {
        console.error("Error fetching the Employees :", error)
        res.status(500).json({ message: error.message })
    }
}


export const updateEmployee = async (req, res) => {
    try {
        const updatedEmployeeData = req.body
        const employee = await Employee.findByIdAndUpdate(req.params.id, updatedEmployeeData, { new: true })
        if (!employee) return res.status(404).json({ message: "Employee not found" })
        res.status(200).json({ message: "Employee updated successfully!", employee })
    } catch (error) {
        console.error("Error updating the Employee: ", error)
        res.status(500).json({ message: error.message })
    }
}


export const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id)
        if (!employee) return res.status(404).json({ message: "Subject not found" })
        res.status(200).json({ message: "Subject deleted successfully!" })
    } catch (error) {
        console.error("Error deleted Employee")
        res.status(200).json({ message: error.message })
    }
}


export const employeeChangePassword = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Employee.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { currentPassword, newPassword } = req.body;

    // Check old password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect current password" });

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: `Password changed successfully, Your password is ${newPassword}`  });
  } catch (err) {
    console.error("Password change error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const employeeForgotPassword = async (req, res) => {
  const { email } = req.body;
  const employee = await Employee.findOne({ email });
  if (!employee) return res.status(404).json({ message: "Employee not found." });

  const token = crypto.randomBytes(20).toString('hex');
  employeeResetTokens.set(token, { email, expiresAt: Date.now() + 15 * 60 * 1000 });

  res.status(200).json({ message: "Employee reset token generated", resetToken: token });
};


export const employeeResetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const data = employeeResetTokens.get(resetToken);

  if (!data || data.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Token invalid or expired." });
  }

  const employee = await Employee.findOne({ email: data.email });
  if (!employee) return res.status(404).json({ message: "Employee not found." });

  employee.password = await bcrypt.hash(newPassword, 10);
  await employee.save();
  employeeResetTokens.delete(resetToken);

  res.status(200).json({ message: "Password reset successfully for employee." });
};


import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users." });
  }
};


export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

