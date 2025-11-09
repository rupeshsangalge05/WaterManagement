import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const ResetPasswordForm = ({ role }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ resetToken, newPassword }) => {
    try {
      const res = await axios.post(`http://localhost:5000/employee/resetPassword`, { resetToken, newPassword });
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className='p-5 mt-5'>
      <Card className="p-5 mt-5 shadow-sm rounded">
        <h4>Reset Password - {role}</h4>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Reset Token</Form.Label>
            <Form.Control type="text" {...register("resetToken", { required: true })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" {...register("newPassword", { required: true, minLength: 6 })} />
            {errors.newPassword && <Form.Text className="text-danger">Password is required (min 6 characters)</Form.Text>}
          </Form.Group>
          <Button variant="success" type="submit">Reset Password</Button>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
