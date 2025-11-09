import axios from 'axios';
import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [contact, setContact] = useState([]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/contact', data);
      alert(response.data.message || 'Message sent successfully!');
      setContact(response.data);
      reset();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const cardStyle = {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <section className="contact rounded">
      <Container className="py-5 d-flex align-items-center justify-items-between">
        <Row className="g-">
          {/* Form Section */}
          <Col lg={6} className="shadow border rounded p-4 bg-white">
            <div className="text-center mx-auto pb-4" style={{ maxWidth: '800px' }}>
              <h4 className="text-uppercase text-primary">Let's Connect</h4>
              <h1 className="display-5 text-capitalize mb-3">Send Your Message</h1>
              <p className="mb-4 text-muted">
                Have a question or just want to say hello? We’d love to hear from you!
              </p>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="g-4">
                <Col md={6}>
                  <Form.Floating>
                    <Form.Control
                      type="text"
                      id="name"
                      placeholder="Your Name"
                      className="border shadow"
                      {...register('name', { required: true })}
                      isInvalid={!!errors.name}
                    />
                    <label htmlFor="name">Your Name</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating>
                    <Form.Control
                      type="email"
                      id="email"
                      placeholder="Your Email"
                      className="border shadow"
                      {...register('email', { required: true })}
                      isInvalid={!!errors.email}
                    />
                    <label htmlFor="email">Your Email</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating>
                    <Form.Control
                      type="tel"
                      id="phone"
                      placeholder="Phone"
                      className="border shadow"
                      {...register('phone', { required: true })}
                      isInvalid={!!errors.phone}
                    />
                    <label htmlFor="phone">Your Phone</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating>
                    <Form.Control
                      type="text"
                      id="subject"
                      placeholder="Subject"
                      className="border shadow"
                      {...register('subject', { required: true })}
                      isInvalid={!!errors.subject}
                    />
                    <label htmlFor="subject">Subject</label>
                  </Form.Floating>
                </Col>
                <Col xs={12}>
                  <Form.Floating>
                    <Form.Control
                      as="textarea"
                      id="message"
                      placeholder="Leave a message here"
                      style={{ height: '150px' }}
                      className="border shadow"
                      {...register('message', { required: true })}
                      isInvalid={!!errors.message}
                    />
                    <label htmlFor="message">Message</label>
                  </Form.Floating>
                </Col>
                <Col xs={12}>
                  <button className="btn btn-primary w-100 py-3" type="submit">
                    Send Message
                  </button>
                </Col>
              </Row>
            </Form>
          </Col>

          {/* Info + Map Section */}
          <Col lg={6} className="shadow border rounded p-4 bg-white">
            <Row className="g-4">
              {/* Address Card */}
              <Col xs={12}>
                <div
                  className="d-flex align-items-center p-3 rounded bg-light"
                  style={cardStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <i className="fas fa-map-marker-alt fa-2x text-primary me-3"></i>
                  <div>
                    <h5 className="mb-1">Address</h5>
                    <p className="mb-0">Ligand Software Solutions</p>
                  </div>
                </div>
              </Col>

              {/* Email */}
              <Col sm={6}>
                <div
                  className="d-flex align-items-center p-3 rounded bg-light"
                  style={cardStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <i className="fas fa-envelope fa-2x text-primary me-3"></i>
                  <div>
                    <h5 className="mb-1">Email</h5>
                    <p className="mb-0">info@example.com</p>
                  </div>
                </div>
              </Col>

              {/* Phone */}
              <Col sm={6}>
                <div
                  className="d-flex align-items-center p-3 rounded bg-light"
                  style={cardStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <i className="fa fa-phone-alt fa-2x text-primary me-3"></i>
                  <div>
                    <h5 className="mb-1">Phone</h5>
                    <p className="mb-0">+91 99478 35620</p>
                  </div>
                </div>
              </Col>

              {/* Map */}
              <Col xs={12}>
                <div className="overflow-hidden rounded mt-2">
                  <iframe
                    className="w-100 rounded"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4411.666204653599!2d74.48617349645399!3d16.258603626474443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc0931673d7c8dd%3A0xc144c2d0dfb000bc!2sLIGAND%20SOFTWARE%20SOLUTIONS!5e0!3m2!1smr!2sin!4v1741668743430!5m2!1smr!2sin"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map Location"
                  ></iframe>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;
