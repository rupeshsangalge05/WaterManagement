// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { Form, Button, Card } from 'react-bootstrap';
// import axios from 'axios';

// const ResetPasswordForm = ({ role }) => {
//   const { register, handleSubmit, formState: { errors } } = useForm();

//   const onSubmit = async ({ resetToken, newPassword }) => {
//     try {
//       const res = await axios.post(`http://localhost:5000/employee/resetPassword`, { resetToken, newPassword });
//       alert(res.data.message);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Reset failed');
//     }
//   };

//   return (
//     <div className='p-5 mt-5'>
//       <Card className="p-5 mt-5 shadow-sm rounded">
//         <h4>Reset Password - {role}</h4>
//         <Form onSubmit={handleSubmit(onSubmit)}>
//           <Form.Group className="mb-3">
//             <Form.Label>Reset Token</Form.Label>
//             <Form.Control type="text" {...register("resetToken", { required: true })} />
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>New Password</Form.Label>
//             <Form.Control type="password" {...register("newPassword", { required: true, minLength: 6 })} />
//             {errors.newPassword && <Form.Text className="text-danger">Password is required (min 6 characters)</Form.Text>}
//           </Form.Group>
//           <Button variant="success" type="submit">Reset Password</Button>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default ResetPasswordForm;










import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import api from '../api';

const ResetPasswordForm = ({ role = 'employee' }) => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { resetToken: tokenFromUrl },
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const newPassword = watch('newPassword');

  const onSubmit = async ({ resetToken, newPassword }) => {
    setMessage('');
    setError('');
    try {
      // Same bug as ForgotPassword.jsx: original always hit
      // /employee/resetPassword regardless of `role`.
      const endpoint = role.toLowerCase() === 'employee' ? '/employee/resetPassword' : '/user/resetPassword';
      const res = await api.post(endpoint, { resetToken, newPassword });
      setMessage(res.data.message || 'Password reset successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className='p-5 mt-5'>
      <Card className="p-5 mt-5 shadow-sm rounded">
        <h4>Reset Password - {role}</h4>
        {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Reset Token</Form.Label>
            {/* Auto-filled from ?token= in the URL if the email link
                includes it. Original forced the user to manually
                copy-paste this — more error-prone, and probably doesn't
                match whatever your backend actually emails out. Verify
                the query param name matches what your email template sends. */}
            <Form.Control type="text" {...register("resetToken", { required: "Reset token is required" })}
              isInvalid={!!errors.resetToken} />
            <Form.Control.Feedback type="invalid">{errors.resetToken?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password"
              {...register("newPassword", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
              isInvalid={!!errors.newPassword} />
            <Form.Control.Feedback type="invalid">{errors.newPassword?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control type="password"
              {...register("confirmPassword", {
                required: "Please confirm the password",
                validate: (value) => value === newPassword || "Passwords do not match",
              })}
              isInvalid={!!errors.confirmPassword} />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="success" type="submit">Reset Password</Button>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
