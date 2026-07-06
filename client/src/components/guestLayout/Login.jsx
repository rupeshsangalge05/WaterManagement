import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container, Alert, Spinner, Nav } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', data);
      const { role, token, user } = response.data;

      alert(response.data.message);
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', user.id);

      const redirectPath = localStorage.getItem("redirectAfterLogin") || `/${role.toLowerCase()}`;
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  const cardStyle = {
    maxWidth: '500px',
    width: '100%',
    margin: 'auto',
    border: '1px solid #f8d7da',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const cardHoverEffect = {
    transform: 'scale(1.01)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
  };

  const linkStyle = (index) => ({
    backgroundColor: hoveredIndex === index ? '#f8f9fa' : 'transparent',
    borderRadius: '6px',
    padding: '4px 8px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    color: '#0d6efd',
    fontWeight: 500,
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="py-5 px-3 d-flex justify-content-center align-items-center">
      <div
        style={isHovered ? { ...cardStyle, ...cardHoverEffect } : cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3 className="mb-4 text-center">🔐 Login</h3>
        {message && <Alert variant="danger">{message}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              {...register("email", { required: "Email is required" })}
              isInvalid={errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              isInvalid={errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" disabled={isSubmitting} className="w-100">
            {isSubmitting ? <Spinner animation="border" size="sm" /> : "Login"}
          </Button>

          <div className="d-flex flex-wrap justify-content-between gap-2 mt-4">
            <Nav.Link
              as={Link}
              to="/register"
              style={linkStyle(0)}
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              Register as new employee
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/newConnection"
              style={linkStyle(1)}
              onMouseEnter={() => setHoveredIndex(1)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              Apply for new connection
            </Nav.Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
