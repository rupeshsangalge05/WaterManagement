import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
  Container, Row, Col, Form, Button, Card, Alert, Image, Spinner
} from 'react-bootstrap';

const ComplaintManager = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [complaints, setComplaints] = useState([]);
  const [editComplaint, setEditComplaint] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/user/complaintForUser', {
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

  useEffect(() => {
    if (editComplaint) {
      reset({
        name: editComplaint.name,
        email: editComplaint.email,
        subject: editComplaint.subject,
        message: editComplaint.message
      });

      setPhotoPreview(editComplaint.photo ? `http://localhost:5000/uploads/complaints/${editComplaint.photo}` : null);
      setVideoPreview(editComplaint.video ? `http://localhost:5000/uploads/complaints/${editComplaint.video}` : null);
    }
  }, [editComplaint, reset]);

  const onSubmit = async (data) => {
    setSuccess('');
    setError('');
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if ((key === 'photo' || key === 'video') && value?.[0]) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    try {
      if (editComplaint) {
        await axios.put(`http://localhost:5000/user/complaint/${editComplaint._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Complaint updated!');
      } else {
        await axios.post(`http://localhost:5000/user/complaint`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Complaint submitted!');
      }

      reset();
      setEditComplaint(null);
      setPhotoPreview(null);
      setVideoPreview(null);
      fetchComplaints();
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await axios.delete(`http://localhost:5000/user/complaint/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Complaint deleted!');
      fetchComplaints();
    } catch {
      setError('Delete failed.');
    }
  };

  const cardBaseStyle = {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    borderRadius: '12px',
    border: '1px solid #dee2e6',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  };

  return (
    <Container className="py-5">
      <Container className='border p-5 border-primary-subtle rounded shadow mb-5'>
        <h3 className="mb-4">{editComplaint ? '✏️ Edit Complaint' : '📝 Submit a Complaint'}</h3>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="border p-4 rounded mb-5">
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control {...register('name', { required: true })} />
                {errors.name && <small className="text-danger">Required</small>}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" {...register('email', { required: true })} />
                {errors.email && <small className="text-danger">Required</small>}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control {...register('subject', { required: true })} />
                {errors.subject && <small className="text-danger">Required</small>}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={3} {...register('message', { required: true })} />
            {errors.message && <small className="text-danger">Required</small>}
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Photo (optional)</Form.Label>
                <Form.Control type="file" accept="image/*" {...register('photo')} onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setPhotoPreview(URL.createObjectURL(file));
                }} />
                {photoPreview && <Image src={photoPreview} className="mt-2" width={200} />}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Video (optional)</Form.Label>
                <Form.Control type="file" accept="video/*" {...register('video')} onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setVideoPreview(URL.createObjectURL(file));
                }} />
                {videoPreview && (
                  <video controls width="200" className="mt-2">
                    <source src={videoPreview} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit">{editComplaint ? 'Update Complaint' : 'Submit Complaint'}</Button>{' '}
          {editComplaint && (
            <Button variant="secondary" onClick={() => {
              reset();
              setEditComplaint(null);
              setPhotoPreview(null);
              setVideoPreview(null);
            }}>
              Cancel
            </Button>
          )}
        </Form>
      </Container>

      <Container className='border p-5 border-primary-subtle rounded shadow'>
      <h4 className="mb-4">📋 Your Complaints</h4>
      {loading ? (
        <Spinner animation="border" />
      ) : complaints.length === 0 ? (
        <Alert variant="info">You haven’t submitted any complaints yet.</Alert>
      ) : (
        <Row>
          {complaints.map((c, index) => (
            <Col md={4} key={c._id}>
              <Card style={cardBaseStyle}>
                <Card.Body>
                  <p><strong>Name:</strong> {c.name}</p>
                  <p><strong>Email:</strong> {c.email}</p>
                  <p><strong>Subject: </strong> {c.subject}</p>
                  <p><strong>Message: </strong> {c.message}</p>

                  <div className='d-flex'>
                  <div className='  gap-2'>
                    {c.photo && (
                    <Image
                      src={`http://localhost:5000/uploads/complaints/${c.photo}`}
                      alt="Complaint"
                      
                      className="me-2 mt-0"
                      width={150}
                    />
                  )}
                  </div>
                  <div>
                    {c.video && (
                    <video controls width={150} className="mt-">
                      <source src={`http://localhost:5000/uploads/complaints/${c.video}`} type="video/mp4" />
                    </video>
                  )}
                  </div>
                  </div>

                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="info"
                      className="me-2"
                      onClick={() => setEditComplaint(c)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      </Container>
    </Container>
  );
};

export default ComplaintManager;
