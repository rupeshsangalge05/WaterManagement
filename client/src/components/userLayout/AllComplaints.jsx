import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col, Alert, Spinner, Image } from 'react-bootstrap';

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/complaintForUser');
        setComplaints(response.data.complaints || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load complaints.');
        setTimeout(() => setError(''), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <Spinner animation="border" className="m-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className=''>
      <Container className="my-5 p-5">
        <h3>📋 All Complaints</h3>
        {complaints.length === 0 ? (
          <Alert variant="info">No complaints found.</Alert>
        ) : (
          <Row>
            {complaints.map((c) => (
              <Col md={6} lg={4} key={c.complaintId} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{c.subject}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{c.fullName} ({c.email})</Card.Subtitle>
                    <Card.Text>{c.message}</Card.Text>
                    {c.photo && (
                      <Image src={`http://localhost:5000/uploads/${c.photo}`} alt="Complaint Photo" fluid thumbnail />
                    )}
                    {c.video && (
                      <video width="100%" controls className="mt-2">
                        <source src={`http://localhost:5000/uploads/${c.video}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    <p className="mt-2 mb-0"><strong>Status:</strong> {c.status}</p>
                    {c.adminResponse && (
                      <p><strong>Admin Response:</strong> {c.adminResponse}</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default AllComplaints;
