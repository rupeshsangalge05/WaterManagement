import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const blogPosts = [
  {
    id: 1,
    title: "Effective Strategies for Water Management",
    date: "Mar 10 2025",
    image: "https://imgs.search.brave.com/J5e32a2vtXYSmZs--H5RnjbolTK2JDe6qtEfK1S6LEc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zN2Qx/LnNjZW5lNy5jb20v/aXMvaW1hZ2Uvd2Jj/b2xsYWIvaW1hZ2lu/ZV9oMjA_cWx0PTkw/JmZtdD13ZWJwJnJl/c01vZGU9c2hhcnAy",
    description: "Discover innovative ways to conserve and manage water effectively.",
  },
  {
    id: 2,
    title: "Sustainable Water Solutions for the Future",
    date: "Mar 15 2025",
    image: "https://imgs.search.brave.com/DQlXgIOTAGx5u2aQPB_FeB1fCSGwGbaNOvMYxukIFrs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zN2Qx/LnNjZW5lNy5jb20v/aXMvaW1hZ2Uvd2Jj/b2xsYWIvZGVzYWxp/bmF0aW9uX3BsYW50/XzExNDB4NTAwP3Fs/dD05MCZmbXQ9d2Vi/cCZyZXNNb2RlPXNo/YXJwMg",
    description: "How technology is shaping the future of water sustainability.",
  },
  {
    id: 3,
    title: "Community Initiatives for Water Preservation",
    date: "Mar 20 2025",
    image: "https://imgs.search.brave.com/ncdcgvNK3-K_NezOcwusgWni8J1r6QijYU3A1Mj8Rkg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Z3N0YXRpYy5jb20v/bWFya2V0aW5nLWNt/cy9hc3NldHMvaW1h/Z2VzL2NhLzU0L2Yy/MTM0ZDBkNGZlZjhi/ZjJjNmVlZGM2Nzky/YzkvYnYtcG9uZC1o/ZXJvLWxpdmUtd2lk/dGgtMTAwMC1mb3Jt/YXQtd2VicC53ZWJw",
    description: "How local communities are making a difference in water conservation.",
  },
];

const BlogCard = ({ post }) => {
  const cardStyle = {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: 'none',
    borderRadius: '1rem',
    overflow: 'hidden',
    cursor: 'pointer',
  };

  const handleHover = (e, isHovering) => {
    e.currentTarget.style.transform = isHovering ? 'translateY(-8px)' : 'translateY(0)';
    e.currentTarget.style.boxShadow = isHovering
      ? '0 10px 30px rgba(0,0,0,0.15)'
      : '0 4px 12px rgba(0,0,0,0.05)';
  };

  return (
    <Card
      className="h-100"
      style={cardStyle}
      onMouseEnter={(e) => handleHover(e, true)}
      onMouseLeave={(e) => handleHover(e, false)}
    >
      <Card.Img variant="top" src={post.image} alt={post.title} style={{ height: '220px', objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column">
        <small className="text-muted mb-2">
          <i className="fa fa-calendar-alt me-1"></i> {post.date}
        </small>
        <Card.Title style={{ fontSize: '1.1rem', fontWeight: '600' }}>{post.title}</Card.Title>
        <Card.Text style={{ flex: 1 }}>{post.description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const Blog = () => {
  return (
    <section id="blog" className="py-3">
      <Container>
        <div className="text-center mb-5">
          <h4 className="text-uppercase text-primary">Our Blog</h4>
          <h1 className="display-6 fw-bold text-capitalize">Latest Water Conservation News</h1>
        </div>
        <Row className="g-4 justify-content-center">
          {blogPosts.map((post) => (
            <Col key={post.id} xs={12} sm={6} lg={4}>
              <BlogCard post={post} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Blog;
