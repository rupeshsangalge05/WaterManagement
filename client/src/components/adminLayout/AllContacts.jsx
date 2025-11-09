import { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Spinner, Container, Row, Col, Card } from 'react-bootstrap';

const AllContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/contact');
      setContacts(response.data.contacts || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const styles = {
    card: {
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      borderRadius: '12px',
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5 mb-5">
      <h3 className="text-center mb-4">📬 All Contact Messages</h3>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </Alert>
      )}

      {contacts.length === 0 ? (
        <Alert variant="info">No contacts found.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {contacts.map((contact, index) => (
            <Col key={contact._id}>
              <Card
                className="shadow-sm h-100 contact-card"
                style={styles.card}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, styles.cardHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, styles.card)
                }
              >
                <Card.Body>
                  <Card.Title>{contact.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {contact.email}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Subject:</strong> {contact.subject}<br />
                    <strong>Message:</strong> {contact.message}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">#{index + 1}</small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AllContacts;
