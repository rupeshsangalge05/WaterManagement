import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Alert, Button, Image, Spinner, Form, Row, Col } from 'react-bootstrap';

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [inputs, setInputs] = useState({});
  const token = localStorage.getItem('jwtToken');

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/user/complaintForAdmin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const body = {
        adminResponse: inputs[id]?.response || '',
        status: inputs[id]?.status || 'Pending'
      };

      await axios.put(`http://localhost:5000/admin/complaints/${id}/respond`, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('Response submitted!');
      setInputs(prev => ({
        ...prev,
        [id]: { response: '', status: 'Pending' }
      }));
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setError('Failed to submit response.');
    }
  };

  return (
    <Container className="my-5 py-5">
      <h3>🛠 Admin Complaint Management</h3>
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : complaints.length === 0 ? (
        <Alert variant="info">No complaints found.</Alert>
      ) : (
        <Table bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>User Info</th>
              <th>Complaint</th>
              <th>Media</th>
              <th>Status / Response</th>
              <th>Admin Response</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, i) => (
              <tr key={c._id}>
                <td>{i + 1}</td>
                <td>
                  <strong>Name: {c.fullName}</strong><br />
                  <p>Email: {c.email}</p>
                </td>
                <td>
                  <strong>Subject: {c.subject}</strong><br />
                  <p>Message: {c.message}</p>
                </td>
                <td>
                  <div>{c.photo && (
                    <Image
                      src={`http://localhost:5000/uploads/complaints/${c.photo}`}
                      
                      width={100}
                      className="mb-2"
                    />
                  )}</div>
                  <div>{c.video && (
                    <video width="100" controls>
                      <source src={`http://localhost:5000/uploads/complaints/${c.video}`} type="video/mp4" />
                    </video>
                  )}</div>
                </td>
                <td>
                  <span className={`badge ${
                    c.status === 'Resolved'
                      ? 'bg-success'
                      : c.status === 'Rejected'
                      ? 'bg-danger'
                      : 'bg-warning text-dark'
                  }`}>
                    {c.status} 
                  </span>
                </td>
                <td>
                  <Form onSubmit={(e) => handleSubmit(e, c._id)}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Write a response..."
                        value={inputs[c._id]?.response || ''}
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            [c._id]: {
                              ...inputs[c._id],
                              response: e.target.value
                            }
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Select
                        value={inputs[c._id]?.status || c.status || 'Pending'}
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            [c._id]: {
                              ...inputs[c._id],
                              status: e.target.value
                            }
                          })
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </Form.Select>
                    </Form.Group>

                    <Button type="submit" size="sm" variant="primary">Submit</Button>
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AllComplaints;
