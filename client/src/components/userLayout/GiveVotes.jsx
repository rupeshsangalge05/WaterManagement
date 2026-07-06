// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Card, Row, Col, Alert, Button, Spinner, Image } from 'react-bootstrap';
// import { HandThumbsUp, HandThumbsDown } from 'react-bootstrap-icons';
// import { useNavigate } from 'react-router-dom';

// const UserComplaints = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [error, setError]         = useState('');
//   const [msg, setMsg]             = useState('');
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token'); 

//   // Fetch all complaints
//   const fetchComplaints = async () => {
//     try {
//       const { data } = await axios.get('http://localhost:5000/user/complaint',{
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setComplaints(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error(e);
//       setError('Could not load complaints');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Vote handler
//   const handleVote = async (complaintId, voteType) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       // Not logged in → save intent and redirect to login
//       localStorage.setItem('redirectAfterLogin', '/user/complaints');
//       localStorage.setItem('voteIntent', JSON.stringify({ complaintId, voteType }));
//       return navigate('/login');
//     }
//     try {
//       const headers = { Authorization: `Bearer ${token}` };
//       const { data } = await axios.post(`http://localhost:5000/user/complaint/${complaintId}/vote`,
//         { voteType },{ headers }
//       );
//       setMsg(data.message);
//       setTimeout(() => setMsg(''), 3000);
//       fetchComplaints();
//     } catch (e) {
//       console.error(e);
//       setError('Voting failed');
//     }
//   };

//   useEffect(() => {
//     fetchComplaints();

//     // If we just came from login with an intent:
//     const intent = JSON.parse(localStorage.getItem('voteIntent') || 'null');
//     const token  = localStorage.getItem('token');
//     if (intent && token) {
//       handleVote(intent.complaintId, intent.voteType);
//       localStorage.removeItem('voteIntent');
//       localStorage.removeItem('redirectAfterLogin');
//     }
//   }, []);

//   if (loading) return <Spinner className="m-5" />;
//   if (error)   return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Container className="my-5 py-5">
//       {msg && <Alert variant="success" dismissible>{msg}</Alert>}
//       {error && <Alert variant="success" dismissible>{error}</Alert>}
//       <h3>Public Complaints</h3>
//       <Row>
//         {complaints.map(c => {
//           // safe default for votes array
//           const votes = Array.isArray(c.votes) ? c.votes : [];
//           const upvotes   = votes.filter(v => v.voteType === 'upvote').length;
//           const downvotes = votes.filter(v => v.voteType === 'downvote').length;

//           return (
//             <Col md={6} lg={4} key={c._id}>
//               <Card className="mb-4">
//                 <Card.Body>
//                   <Card.Title> <strong>Subject:</strong> {c.subject}</Card.Title>
//                   <Card.Subtitle className="mb-2 text-muted">
//                     {c.fullName} ({c.email})
//                   </Card.Subtitle>
//                   <Card.Text> <strong>Message:</strong> {c.message}</Card.Text>

//                   {c.photo && (
//                     // <Image src={`http://localhost:5000/uploads/${c.photo}`} thumbnail className="mb-2" />
//                     <Image src={`http://localhost:5000/uploads/complaints/${c.photo}`} thumbnail className="mb-2" />
//                   )}
//                   {c.photo.endsWith('.mp4')&& (
//                     <video width="100%" controls className="mb-2">
//                       <source src={`http://localhost:5000/uploads/complaints/${c.video}`} type="video/mp4" />
//                       Your browser does not support the video tag.
//                     </video>
//                   )}

//                   <div className="d-flex justify-content-between align-items-center mt-3">
//                     <div>
//                       <Button
//                         variant="outline-success"
//                         size="sm"
//                         onClick={() => handleVote(c._id, 'upvote')}
//                       >
//                         <HandThumbsUp /> {upvotes}
//                       </Button>
//                       <Button
//                         variant="outline-danger"
//                         size="sm"
//                         className="ms-2"
//                         onClick={() => handleVote(c._id, 'downvote')}
//                       >
//                         <HandThumbsDown /> {downvotes}
//                       </Button>
//                     </div>
//                     <span>Status: {c.status || 'Pending'}</span>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           );
//         })}
//       </Row>
//     </Container>
//   );
// };

// export default UserComplaints;





import React, { useEffect, useState } from 'react';
import api from '../api';
import { Container, Card, Row, Col, Alert, Button, Spinner, Image } from 'react-bootstrap';
import { HandThumbsUp, HandThumbsDown } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const UserComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');   // page-load failure — blocks the list
  const [actionError, setActionError] = useState(''); // vote failure — should NOT blank the page
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/user/complaint');
      setComplaints(Array.isArray(data) ? data : []);
    } catch (e) {
      setLoadError('Could not load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (complaintId, voteType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/user/complaints');
      localStorage.setItem('voteIntent', JSON.stringify({ complaintId, voteType }));
      return navigate('/login');
    }
    try {
      const { data } = await api.post(`/user/complaint/${complaintId}/vote`, { voteType });
      setMsg(data.message);
      setTimeout(() => setMsg(''), 3000);
      fetchComplaints();
    } catch (e) {
      // BUG FIX: original set the same `error` state used for the
      // full-page load failure. One failed vote click made the entire
      // complaints list disappear behind a red banner. Voting failures
      // are transient and shouldn't nuke the page.
      setActionError('Voting failed');
      setTimeout(() => setActionError(''), 3000);
    }
  };

  useEffect(() => {
    fetchComplaints();

    const intent = JSON.parse(localStorage.getItem('voteIntent') || 'null');
    const token = localStorage.getItem('token');
    if (intent && token) {
      handleVote(intent.complaintId, intent.voteType);
      localStorage.removeItem('voteIntent');
      localStorage.removeItem('redirectAfterLogin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Spinner className="m-5" />;
  if (loadError) return <Alert variant="danger">{loadError}</Alert>;

  return (
    <Container className="my-5 py-5">
      {msg && <Alert variant="success" dismissible onClose={() => setMsg('')}>{msg}</Alert>}
      {/* BUG FIX: this was rendering errors with variant="success" — a
          failed vote showed up in a green box. Also unreachable in the
          original due to the early `if (error) return` above. */}
      {actionError && <Alert variant="danger" dismissible onClose={() => setActionError('')}>{actionError}</Alert>}

      <h3>Public Complaints</h3>
      <Row>
        {complaints.map(c => {
          const votes = Array.isArray(c.votes) ? c.votes : [];
          const upvotes = votes.filter(v => v.voteType === 'upvote').length;
          const downvotes = votes.filter(v => v.voteType === 'downvote').length;

          return (
            <Col md={6} lg={4} key={c._id}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title><strong>Subject:</strong> {c.subject}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {c.fullName} ({c.email})
                  </Card.Subtitle>
                  <Card.Text><strong>Message:</strong> {c.message}</Card.Text>

                  {/* BUG FIX: original called c.photo.endsWith('.mp4') to
                      decide whether to render a video — this throws
                      whenever a complaint has no photo at all, and it's
                      the wrong field to check in the first place. Check
                      each media field independently. */}
                  {c.photo && (
                    <Image src={`${api.defaults.baseURL}/uploads/complaints/${c.photo}`} thumbnail className="mb-2" />
                  )}
                  {c.video && (
                    <video width="100%" controls className="mb-2">
                      <source src={`${api.defaults.baseURL}/uploads/complaints/${c.video}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <Button variant="outline-success" size="sm" onClick={() => handleVote(c._id, 'upvote')}>
                        <HandThumbsUp /> {upvotes}
                      </Button>
                      <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleVote(c._id, 'downvote')}>
                        <HandThumbsDown /> {downvotes}
                      </Button>
                    </div>
                    <span>Status: {c.status || 'Pending'}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default UserComplaints;
