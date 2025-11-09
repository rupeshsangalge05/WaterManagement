import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFaucet, FaIndustry, FaRecycle } from 'react-icons/fa';

const services = [
  {
    title: 'Residential Water Solutions',
    description: 'Ensuring safe and clean water access for households.',
    icon: <FaFaucet size={32} />,
    delay: '0.2s',
  },
  {
    title: 'Industrial Water Treatment',
    description: 'Advanced solutions for industrial water purification.',
    icon: <FaIndustry size={32} />,
    delay: '0.4s',
  },
  {
    title: 'Eco-Friendly Water Recycling',
    description: 'Innovative methods to recycle and reuse water efficiently.',
    icon: <FaRecycle size={32} />,
    delay: '0.6s',
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className='py-3'
    >
      <Container>
        <div
          className="text-center mx-auto pb-5"
          data-wow-delay="0.2s"
          style={{ maxWidth: '800px' }}
        >
          <h4
            style={{
              textTransform: 'uppercase',
              color: '#0d6efd',
              fontSize: '1.25rem',
            }}
          >
            Our Services
          </h4>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: '600',
              marginTop: '1rem',
            }}
          >
            Innovative Water Management & Preservation
          </h1>
        </div>

        <Row className="gy-4">
          {services.map((service, idx) => (
            <Col key={idx} xs={12} md={6} lg={4}>
              <div
                className="service-card"
                style={{
                  backgroundColor: '#fff',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'translateY(-5px)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'translateY(0)')
                }
              >
                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#0d6efd',
                      color: '#fff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem',
                    }}
                  >
                    {service.icon}
                  </div>
                  <h5 style={{ marginBottom: 0, fontSize: '1.1rem' }}>
                    {service.title}
                  </h5>
                </div>
                <p style={{ color: '#6c757d', fontSize: '0.95rem' }}>
                  {service.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Services;
