import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const About = () => {
  const cardStyle = {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    borderRadius: '1rem',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  };

  const hoverEffect = (e, hover) => {
    e.currentTarget.style.transform = hover ? 'translateY(-6px)' : 'translateY(0)';
    e.currentTarget.style.boxShadow = hover
      ? '0 8px 25px rgba(0,0,0,0.15)'
      : '0 4px 10px rgba(0,0,0,0.05)';
  };

  return (
    <section id="about" className="overflow-hidden py-3 my-3 rounded" style={{ backgroundColor: '#ffffff' }}>
      <Container>
        <Row className="g-5 align-items-center">
          {/* Image Column */}
          <Col xs={12} xl={6} className="order-2 order-xl-1">
            <div className="rounded overflow-hidden shadow-sm">
              <img
                src="https://social-innovation.hitachi/-/media/project/hitachi/sib/en-in/knowledge-hub/leadership/clean-drinking-smart-water-management/water-management-technology.jpg?la=en-IN&upd=20220210054743Z&hash=23CBC4F05B9E51FCF93B482F5542E03B"
                alt="Water Conservation"
                className="img-fluid w-100"
                style={{
                  objectFit: 'cover',
                  maxHeight: '480px',
                  borderRadius: '1rem',
                }}
              />
            </div>
          </Col>

          {/* Text & Cards */}
          <Col xs={12} xl={6} className="order-1 order-xl-2">
            <div className="about-item">
              <h4 className="text-primary text-uppercase">Who We Are</h4>
              <h1 className="display-6 fw-bold mb-3">
                Leading the Future of Water Sustainability
              </h1>
              <p className="mb-4">
                With more than two decades of expertise, we specialize in innovative water
                management solutions. Our mission is to safeguard water resources and implement
                eco-friendly technologies to ensure a sustainable future.
              </p>

              {/* Card 1 */}
              <div
                className="p-4 mb-4 border border-primary-subtle"
                style={cardStyle}
                onMouseEnter={(e) => hoverEffect(e, true)}
                onMouseLeave={(e) => hoverEffect(e, false)}
              >
                <div className="d-flex align-items-start">
                  <div className="me-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: '50px', height: '50px' }} >
                      <i className="fas fa-users fa-lg" />
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-2">Community Commitment</h5>
                    <p className="mb-0">
                      We work closely with communities to implement sustainable water practices,
                      ensuring access to clean water for all.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="p-4 mb-2 border border-primary-subtle"
                style={cardStyle}
                onMouseEnter={(e) => hoverEffect(e, true)}
                onMouseLeave={(e) => hoverEffect(e, false)}
              >
                <div className="d-flex align-items-start">
                  <div className="me-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: '60px', height: '60px' }}
                    >
                      <i className="fas fa-recycle fa-lg" />
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-2">Sustainable Solutions</h5>
                    <p className="mb-0">
                      Our solutions focus on reducing water waste, enhancing recycling, and
                      promoting conservation efforts worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;
