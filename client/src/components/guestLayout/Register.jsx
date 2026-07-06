import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Spinner, Row, Col, Nav } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";

const Register = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const [employee, setEmployee] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hover, setHover] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/employee/register", { ...data });
      setEmployee(response.data);
      if (response.status === 201) {
        setMessage(`Employee ${response.data.fullName || ""} registered successfully!`);
        reset();
        setTimeout(() => setMessage(""), 2000);
      } else {
        setError("Failed to register employee.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting the form. Try again.");
    }
  };

  
  const cardStyle = {
    maxWidth: "900px",
    width: "100%",
    padding: "2rem",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    border: "1px solid #dee2e6",
    boxShadow: hover ? "0 12px 24px rgba(0,0,0,0.15)" : "0 6px 12px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  };

  return (
    <div className="d-flex justify-content-center align-items-center px-3 py-5 my-5 rounded" style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Container style={cardStyle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} >
        <h3 className="mb-4 text-center">👨‍💼 Employee Registration</h3>

        {message && <Alert variant="success" dismissible>{message}</Alert>}
        {error && <Alert variant="danger" dismissible>{error}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" {...register("fullName", { required: "Full name is required" })} />
                {errors.fullName && <Form.Text className="text-danger">{errors.fullName.message}</Form.Text>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" {...register("email", { required: "Email is required" })} />
                {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select {...register("gender", { required: "Gender is required" })}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
                {errors.gender && <Form.Text className="text-danger">{errors.gender.message}</Form.Text>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" {...register("address", { required: "Address is required" })} />
                {errors.address && <Form.Text className="text-danger">{errors.address.message}</Form.Text>}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control type="text" {...register("contact", { required: "Contact number is required" })} />
                {errors.contact && <Form.Text className="text-danger">{errors.contact.message}</Form.Text>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" {...register("password", { required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
                {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>}
              </Form.Group>
            </Col>
          </Row>
                  
          <Button type="submit" disabled={isSubmitting} className="w-100 mt-2">
            {isSubmitting ? <Spinner animation="border" size="sm" /> : "Register"}
          </Button>

          <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center align-items-center">
            <span>Already have an account?</span>
            <Nav.Link as={Link} to="/login" style={{ textDecoration: "underline", color: "#0d6efd", fontWeight: "500" }}>
              Login
            </Nav.Link>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default Register;
