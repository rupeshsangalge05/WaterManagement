import { Route, Routes } from 'react-router-dom';
// import './App.css';
import GuestLayout from './components/guestLayout/GuestLayout';
import GuestHome from './components/guestLayout/Home';
import About from './components/guestLayout/About';
import Blog from './components/guestLayout/Blog';
import Contact from './components/guestLayout/Contact';
import Login from './components/guestLayout/Login';
import Register from './components/guestLayout/Register';
import NewConnection from './components/guestLayout/NewConnection';
import AllComplaintsForGuest from './components/guestLayout/AllComplaints';

import UserDashboard from './components/userLayout/Dashboard';
import UserLayout from './components/userLayout/UserLayout';
import MakePayment from './components/userLayout/MakePyament';
import ChangeUserPasswordForm from './components/userLayout/ChangePassword'
import ResetUserForm from './components/userLayout/ResetPassword';
import ForgotUserPasswordForm from './components/userLayout/ForgotPassword';
import ForgotEmployeePasswordForm from './components/userLayout/ForgotPassword';
import ComplaintForm from './components/userLayout/Complaints';

import EmployeeDashboard from './components/employeeLayout/Dashboard';
import EmployeeLayout from './components/employeeLayout/EmployeeLayout';
import ChangeEmployeePasswordForm from './components/employeeLayout/ChangePassword'
import ResetEmployeeForm from './components/employeeLayout/ResetPassword';

import AdminLayout from './components/adminLayout/AdminLayout';
import AddSource from './components/adminLayout/AddSource';
import Connections from './components/adminLayout/AllUsers';
import GenerateBillsModal from './components/adminLayout/GenerateBill';
import AllComplaints from './components/adminLayout/AllComplaints';
import AllContacts from './components/adminLayout/AllContacts';
import AdminHome from './components/adminLayout/Home';
import Timetable from './components/adminLayout/AddTimetable';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<GuestLayout />}>
          <Route index element={<GuestHome />} />
          <Route path='/about' element={<About />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/newConnection' element={<NewConnection />} />
          <Route path='/complaints' element={<AllComplaintsForGuest />} />
        </Route>
        <Route path='/user' element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path='/user/pay' element={<MakePayment />} />
          <Route path='/user/changePassword' element={<ChangeUserPasswordForm />} />
          <Route path='/user/resetPassword' element={<ResetUserForm />} />
          <Route path='/user/forgotPassword' element={<ForgotUserPasswordForm />} />
          <Route path='/user/complaints' element={<ComplaintForm />} />
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path='/admin/addSource' element={<AddSource/>} />
          <Route path='/admin/connections' element={<Connections/>} />
          <Route path='/admin/generateBill' element={<GenerateBillsModal/>} />
          <Route path='/admin/complaints' element={<AllComplaints/>} />
          <Route path='/admin/contacts' element={<AllContacts/>} />
          <Route path='/admin/timetable' element={<Timetable/>} />
        </Route>
        <Route path='/employee' element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path='/employee/changePassword' element={<ChangeEmployeePasswordForm />} />
          <Route path='/employee/resetPassword' element={<ResetEmployeeForm />} />
          <Route path='/employee/forgotPassword' element={<ForgotEmployeePasswordForm />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;