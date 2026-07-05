// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { Form, Button, Card } from 'react-bootstrap';
// import axios from 'axios';

// const ForgotPasswordForm = ({ role }) => {
//   const { register, handleSubmit, formState: { errors } } = useForm();

//   const onSubmit = async ({ email }) => {
//     try {
//       const res = await axios.post(`http://localhost:5000/employee/forgotPassword`, { email });
//       alert(res.data.message);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Something went wrong.');
//     }
//   };

//   return (
//     <Card className="p-5 shadow-sm rounded mt-5">
//       <h4>Forgot Password - {role}</h4>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Form.Group controlId="formEmail" className="mb-3">
//           <Form.Label>Email address</Form.Label>
//           <Form.Control type="email" {...register("email", { required: true })} />
//           {errors.email && <Form.Text className="text-danger">Email is required</Form.Text>}
//         </Form.Group>
//         <Button variant="primary" type="submit">Send Reset Token</Button>
//       </Form>
//     </Card>
//   );
// };

// export default ForgotPasswordForm;






import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import api from '../api';

const ForgotPasswordForm = ({ role = 'employee' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async ({ email }) => {
    setMessage('');
    setError('');
    try {
      // Original code hard-coded `/employee/forgotPassword` no matter
      // what `role` was passed in — the prop was displayed in the
      // heading but never actually used to route the request. If this
      // component is ever rendered with role="user" (looks like it's
      // meant to be, given the prop exists), it silently sent citizens
      // through the employee reset flow.
      //
      // This assumes your backend has a matching `/user/forgotPassword`
      // route. If it doesn't, add one — don't just point this at
      // `/employee/...` again, that reintroduces the same bug.
      const endpoint = role.toLowerCase() === 'employee' ? '/employee/forgotPassword' : '/user/forgotPassword';
      const res = await api.post(endpoint, { email });
      setMessage(res.data.message || 'Reset token sent — check your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Card className="p-5 shadow-sm rounded mt-5">
      <h4>Forgot Password - {role}</h4>
      {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
            })}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">Send Reset Token</Button>
      </Form>
    </Card>
  );
};

export default ForgotPasswordForm;
