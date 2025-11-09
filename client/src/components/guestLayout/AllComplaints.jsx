import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Alert, Spinner, Image } from 'react-bootstrap';

const ComplaintDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/user/complaintForAdmin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const rowStyle = {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = '#f1f3f5';
    e.currentTarget.style.transform = 'scale(1.005)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <Container className="my-5 py-5">
      {error && <Alert variant="danger" dismissible>{error}</Alert>}
      <h4 className="mb-4 fw-bold">📋 All Complaints</h4>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm rounded overflow-hidden">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Name / Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Photo</th>
              <th>Video</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, i) => (
              <tr
                key={c._id}
                style={rowStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <td>{i + 1}</td>
                <td>
                  <strong>{c.name}</strong><br />
                  <small className="text-muted">{c.email}</small>
                </td>
                <td>{c.subject}</td>
                <td>{c.message}</td>
                <td>
                  {c.photo && (
                    <Image
                      src={`http://localhost:5000/uploads/complaints/${c.photo}`}
                      width={100}
                      height="auto"
                      className="rounded"
                      alt="Complaint Photo"
                    />
                  )}
                </td>
                <td>
                  {c.video && (
                    <video width="120" controls className="rounded">
                      <source src={`http://localhost:5000/uploads/complaints/${c.video}`} type="video/mp4" />
                    </video>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ComplaintDashboard;
