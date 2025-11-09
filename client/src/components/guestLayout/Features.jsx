import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const featuresData = [
  {
    title: 'Water Quality Monitoring',
    description: 'Ensuring clean and safe water through advanced quality control measures.',
    icon: 'fas fa-hand-holding-water',
    delay: '0.2s',
  },
  {
    title: 'Advanced Filtration Systems',
    description: 'Implementing multi-stage filtration for optimal water purity.',
    icon: 'fas fa-filter',
    delay: '0.4s',
  },
  {
    title: 'Sustainable Water Use',
    description: 'Promoting water conservation and eco-friendly practices.',
    icon: 'fas fa-recycle',
    delay: '0.6s',
  },
  {
    title: 'Scientific Research',
    description: 'Utilizing cutting-edge technology to improve water management.',
    icon: 'fas fa-microscope',
    delay: '0.8s',
  },
];

const FeatureCard = ({ feature }) => (
  <Col xs={12} sm={6} xl={3} className="mb-4">
    <div
      style={{
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        height: '100%',
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
      <Card className="text-center border border-primary-subtle h-100">
        <Card.Body className="p-4">
          <div className="mb-3">
            <i className={`${feature.icon} text-primary fa-3x`}></i>
          </div>
          <Card.Title as="h5" className="mb-3">{feature.title}</Card.Title>
          <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>{feature.description}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  </Col>
);

const Features = () => {
  return (
    <section style={{ padding: '1rem 0' }}>
      <Container>
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '800px' }}>
          <h4 style={{ textTransform: 'uppercase', color: '#0d6efd', fontSize: '1.2rem' }}>Our Features</h4>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '600' }}>
            Innovative Solutions in Water Management
          </h1>
        </div>
        <Row className="g-4">
          {featuresData.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} />
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Features;
