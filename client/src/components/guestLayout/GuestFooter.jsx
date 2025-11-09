import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaPrint } from 'react-icons/fa';
import logo from './water-drop.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [hover, setHover] = useState(false);

  const footerStyle = {
    backgroundColor: '#212529',
    color: '#ffffff',
    padding: '2rem 1rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    transform: hover ? 'scale(1.02)' : 'scale(1)',
    boxShadow: hover ? '0 10px 20px rgba(0,0,0,0.3)' : '0 4px 8px rgba(0,0,0,0.2)',
    borderRadius: '12px'
  };

  const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem'
  };

  const textStyle = {
    marginBottom: '0.3rem',
    fontSize: '0.95rem'
  };

  return (
    <footer
      style={{ padding: "1rem 1rem", backgroundColor: "#f8f9fa" }}
      className="d-flex justify-content-center"
    >
      <div
        style={footerStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-100"
      >
        <Container>
          <Row className="g-4 align-items-start justify-content-between">
            {/* Logo & Hours */}
            <Col xs={12} md={6} xl={4} className="text-center text-md-start">
              <img src={logo} alt="Logo" width={70} height={70} className="mb-3" />
              <div style={titleStyle}>Working Hours</div>
              <div style={textStyle}>Tue - Sunday: 09.00 AM to 11.00 AM</div>
              <div style={textStyle}>Monday: Water doesn’t leave 💧</div>
            </Col>

                      {/* Navigation Links */}
          <Col xs={12} md={6} xl={4}>
            {/* <div
              style={cardStyle}
              onMouseEnter={handleHoverIn}
              onMouseLeave={handleHoverOut}
            > */}
              <h5>Quick Links</h5>
              <Nav className="flex-column">
                <Nav.Link
                  as={Link}
                  to="/"
                  state={{ scrollTo: 'home' }}
                  className="text-white ps-0"
                >
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="text-white ps-0">
                  About
                </Nav.Link>
                <Nav.Link as={Link} to="/contact" className="text-white ps-0">
                  Contact
                </Nav.Link>
              </Nav>
            {/* </div> */}
          </Col>

            {/* Contact Info */}
            <Col xs={12} md={6} xl={4} className="text-center text-md-start">
              <div style={titleStyle}>Contact</div>
              <div style={textStyle}><FaMapMarkerAlt className="me-2" />123 Aqua Street, H2O City</div>
              <div style={textStyle}><FaEnvelope className="me-2" />contact@waterservice.com</div>
              <div style={textStyle}><FaPhone className="me-2" />+123 456 7890</div>
              <div style={textStyle}><FaPrint className="me-2" />+123 456 7891</div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
