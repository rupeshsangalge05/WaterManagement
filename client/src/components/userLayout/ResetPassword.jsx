import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';

const ResetPasswordForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ resetToken, newPassword }) => {
    try {
      const res = await axios.post('http://localhost:5000/user/resetPassword', {
        resetToken,
        newPassword
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <Card className="p-4 mt-5 shadow-sm rounded w-50 mx-auto">
      <h4>Reset Password</h4>
      <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        <Form.Group className="mb-3">
          <Form.Label>Reset Token</Form.Label>
          <Form.Control
            type="text"
            {...register("resetToken", { required: "Token required" })}
            isInvalid={errors.resetToken}
          />
          <Form.Control.Feedback type="invalid">
            {errors.resetToken?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            {...register("newPassword", { required: "New password required", minLength: { value: 6, message: "Min 6 characters" } })}
            isInvalid={errors.newPassword}
          />
          <Form.Control.Feedback type="invalid">
            {errors.newPassword?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="success">Reset Password</Button>
      </Form>
    </Card>
  );
};

export default ResetPasswordForm;
