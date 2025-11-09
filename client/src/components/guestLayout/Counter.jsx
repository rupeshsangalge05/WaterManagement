import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUsers, FaRecycle, FaTint, FaGlobe } from 'react-icons/fa';

const counterItems = [
  {
    icon: <FaUsers size={40} />,
    title: "Happy Clients",
    value: "1,200",
    delay: "0.2s"
  },
  {
    icon: <FaRecycle size={40} />,
    title: "Water Recycled",
    value: "5M",
    delay: "0.4s"
  },
  {
    icon: <FaTint size={40} />,
    title: "Liters Saved",
    value: "10M",
    delay: "0.6s"
  },
  {
    icon: <FaGlobe size={40} />,
    title: "Global Projects",
    value: "50",
    delay: "0.8s"
  }
];

const Counter = () => {
  return (
    <section className='py-3'>
      <Container>
        <Row className="g-4 text-center justify-content-center">
          {counterItems.map((item, idx) => (
            <Col
              key={idx}
              xs={12}
              sm={6}
              lg={3}
              data-wow-delay={item.delay}
            >
              <div
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  borderRadius: '0.75rem',
                  padding: '2rem 1rem',
                  border: '1px solid #cfe2ff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  height: '100%',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#0d6efd',
                    color: '#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {item.icon}
                </div>
                <h5 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{item.title}</h5>
                <div className="d-flex align-items-end justify-content-center mt-2">
                  <span style={{ fontSize: '2rem', fontWeight: '700' }}>{item.value}</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '600', marginLeft: '0.25rem' }}>+</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Counter;
