import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const ForgotPasswordForm = ({ role }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      const res = await axios.post(`http://localhost:5000/employee/forgotPassword`, { email });
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Card className="p-5 shadow-sm rounded mt-5">
      <h4>Forgot Password - {role}</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" {...register("email", { required: true })} />
          {errors.email && <Form.Text className="text-danger">Email is required</Form.Text>}
        </Form.Group>
        <Button variant="primary" type="submit">Send Reset Token</Button>
      </Form>
    </Card>
  );
};

export default ForgotPasswordForm;
