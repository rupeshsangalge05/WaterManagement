import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Admin from '../models/Admin.js';

dotenv.config();

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

//     // ✅ Hardcoded Super Admin login
//     if (email === 'admin@gmail.com' && password === 'admin@12345') {
//       const token = jwt.sign( { id: 'superadmin', role: 'Admin' }, process.env.JWT_SECRET, { expiresIn: '1d' } );

//       return res.status(200).json({
//         message: "Super Admin login successful!",
//         token,
//         role: 'Admin',
//         user: {
//           id: 'superadmin',
//           fullName: 'Super Admin',
//           email,
//           role: 'Admin'
//         }
//       });
//     }

//     // 🔍 Search in User, Employee, Admin
//     let user = await User.findOne({ email });
//     let role = 'User';

//     if (!user) {
//       user = await Employee.findOne({ email });
//       role = 'Employee';
//     }

//     if (!user) {
//       user = await Admin.findOne({ email });
//       role = 'Admin';
//     }

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // 🔐 Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid credentials." });
//     }

//     // 🎟️ Generate JWT
//     const token = jwt.sign( { id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' } );

//     res.status(200).json({
//       message: "Login successful!",
//       token,
//       role,
//       user: {
//         id: user._id, // ✅ Important for voting
//         fullName: user.fullName,
//         email: user.email,
//         role
//       }
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error. Please try again later." });
//   }
// };




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // ✅ Hardcoded Super Admin login (highest priority)
    if (email === 'admin@gmail.com' && password === 'admin@12345') {
      const token = jwt.sign({ id: 'superadmin', role: 'Admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.status(200).json({
        message: "Super Admin login successful!",
        token,
        role: 'Admin',
        user: {
          id: 'superadmin',
          fullName: 'Super Admin',
          email,
          role: 'Admin'
        }
      });
    }

    // Define login priority (Admin > Employee > User)
    let user = null;
    let role = null;

    user = await Admin.findOne({ email });
    if (user) {
      role = 'Admin';
    } else {
      user = await Employee.findOne({ email });
      if (user) {
        role = 'Employee';
      } else {
        user = await User.findOne({ email });
        if (user) {
          role = 'User';
        }
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: "Login successful!",
      token,
      role,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};