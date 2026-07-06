// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
// import axios from 'axios';

// const ChangePasswordForm = () => {
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')

//   const onSubmit = async ({ currentPassword, newPassword }) => {
//     setMessage("");
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.put(`http://localhost:5000/employee/changePassword`,{ currentPassword, newPassword },
//         { headers: { Authorization: `Bearer ${token}`} }
//       );

//       setMessage("Password changed successfully")
//       setTimeout(() => setMessage(''), 3000);
//       alert(response.data.message);
//       reset();
//     } catch (error) {
//       alert(error.response?.data?.message || 'Change failed');
//       setError("error.response?.data?.message || 'Change failed'")
//     }
//   };

//   return (
//     <div className='p-5'>
//       <Card className="p-4 shadow-sm rounded w-50">
//         <h4>Change Password</h4>
//         {message && <Alert variant="success" dismissible>{message}</Alert>}
//         {error && <Alert variant="danger" dismissible>{error}</Alert>}

//         <Form onSubmit={handleSubmit(onSubmit)} className='mt-5'>
//           <Row>
//             <Col className='d-flex gap-5'>
//               <Form.Group className="mb-3">
//                 <Form.Label>Current Password</Form.Label>
//                 <Form.Control type="password"
//                   {...register("currentPassword", { required: "Current password is required" })}
//                   isInvalid={errors.currentPassword} />
//                 <Form.Control.Feedback type="invalid"> {errors.currentPassword?.message} </Form.Control.Feedback>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>New Password</Form.Label>
//                 <Form.Control type="password" 
//                   {...register("newPassword", { required: "New password is required", minLength: { value: 6, message: "Min 6 characters" } })}
//                   isInvalid={errors.newPassword} />
//                 <Form.Control.Feedback type="invalid"> {errors.newPassword?.message} </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>
//           <Button variant="warning" type="submit">Change Password</Button>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default ChangePasswordForm;



import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import api from '../api';

const ChangePasswordForm = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const newPassword = watch('newPassword');

  const onSubmit = async ({ currentPassword, newPassword }) => {
    setMessage("");
    setError("");

    try {
      const response = await api.put("/employee/changePassword", { currentPassword, newPassword });
      // One notification, not an alert() + state message firing together.
      setMessage(response.data.message || "Password changed successfully");
      setTimeout(() => setMessage(''), 3000);
      reset();
    } catch (err) {
      // BUG FIX: original code did
      //   setError("error.response?.data?.message || 'Change failed'")
      // — that's a quoted string literal, not an evaluated expression.
      // Every failure showed that literal text to the user instead of
      // the actual error message.
      setError(err.response?.data?.message || 'Change failed');
    }
  };

  return (
    <div className='p-5'>
      <Card className="p-4 shadow-sm rounded w-50">
        <h4>Change Password</h4>
        {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)} className='mt-5'>
          <Row>
            <Col className='d-flex gap-5 flex-wrap'>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control type="password"
                  {...register("currentPassword", { required: "Current password is required" })}
                  isInvalid={!!errors.currentPassword} />
                <Form.Control.Feedback type="invalid">{errors.currentPassword?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password"
                  {...register("newPassword", { required: "New password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                  isInvalid={!!errors.newPassword} />
                <Form.Control.Feedback type="invalid">{errors.newPassword?.message}</Form.Control.Feedback>
              </Form.Group>

              {/* Missing in the original — a typo here silently locks the
                  user out with no way to notice before submitting. */}
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm the new password",
                    validate: (value) => value === newPassword || "Passwords do not match",
                  })}
                  isInvalid={!!errors.confirmPassword} />
                <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Button variant="warning" type="submit">Change Password</Button>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;
