// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Table, Alert, Spinner, Image } from 'react-bootstrap';

// const ComplaintDashboard = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const token = localStorage.getItem('token');

//   const fetchComplaints = async () => {
//     try {
//       const { data } = await axios.get('http://localhost:5000/user/complaintForAdmin', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setComplaints(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError('Failed to fetch complaints');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const rowStyle = {
//     transition: 'all 0.3s ease',
//     cursor: 'pointer',
//   };

//   const handleMouseEnter = (e) => {
//     e.currentTarget.style.backgroundColor = '#f1f3f5';
//     e.currentTarget.style.transform = 'scale(1.005)';
//     e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
//   };

//   const handleMouseLeave = (e) => {
//     e.currentTarget.style.backgroundColor = 'transparent';
//     e.currentTarget.style.transform = 'scale(1)';
//     e.currentTarget.style.boxShadow = 'none';
//   };

//   return (
//     <Container className="my-5 py-5">
//       {error && <Alert variant="danger" dismissible>{error}</Alert>}
//       <h4 className="mb-4 fw-bold">📋 All Complaints</h4>

//       {loading ? (
//         <div className="d-flex justify-content-center my-5">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : (
//         <Table striped bordered hover responsive className="shadow-sm rounded overflow-hidden">
//           <thead className="table-dark text-center">
//             <tr>
//               <th>#</th>
//               <th>Name / Email</th>
//               <th>Subject</th>
//               <th>Message</th>
//               <th>Photo</th>
//               <th>Video</th>
//             </tr>
//           </thead>
//           <tbody>
//             {complaints.map((c, i) => (
//               <tr
//                 key={c._id}
//                 style={rowStyle}
//                 onMouseEnter={handleMouseEnter}
//                 onMouseLeave={handleMouseLeave}
//               >
//                 <td>{i + 1}</td>
//                 <td>
//                   <strong>{c.name}</strong><br />
//                   <small className="text-muted">{c.email}</small>
//                 </td>
//                 <td>{c.subject}</td>
//                 <td>{c.message}</td>
//                 <td>
//                   {c.photo && (
//                     <Image
//                       src={`http://localhost:5000/uploads/complaints/${c.photo}`}
//                       width={100}
//                       height="auto"
//                       className="rounded"
//                       alt="Complaint Photo"
//                     />
//                   )}
//                 </td>
//                 <td>
//                   {c.video && (
//                     <video width="120" controls className="rounded">
//                       <source src={`http://localhost:5000/uploads/complaints/${c.video}`} type="video/mp4" />
//                     </video>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// };

// export default ComplaintDashboard;











import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { Container, Table, Alert, Spinner, Image, Form, Pagination } from 'react-bootstrap';

const PAGE_SIZE = 10;

const ComplaintDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      // NOTE: this still fetches everything and paginates client-side.
      // Fine for a demo/small dataset — once this list grows past a
      // few hundred rows, move page/limit/search into query params
      // and let the backend do the filtering.
      const { data } = await api.get('/user/complaintForAdmin');
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return complaints;
    return complaints.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q)
    );
  }, [complaints, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1); // reset to page 1 whenever the search changes
  }, [search]);

  const rowStyle = { transition: 'all 0.3s ease', cursor: 'pointer' };

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
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h4 className="fw-bold mb-0">📋 All Complaints</h4>
        <Form.Control
          type="text"
          placeholder="Search by name, email, or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '320px' }}
        />
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Alert variant="secondary">No complaints match your search.</Alert>
      ) : (
        <>
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
              {pageItems.map((c, i) => (
                <tr
                  key={c._id}
                  style={rowStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td>
                    <strong>{c.name}</strong><br />
                    <small className="text-muted">{c.email}</small>
                  </td>
                  <td>{c.subject}</td>
                  <td>{c.message}</td>
                  <td>
                    {c.photo && (
                      <Image
                        src={`${api.defaults.baseURL}/uploads/complaints/${c.photo}`}
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
                        <source
                          src={`${api.defaults.baseURL}/uploads/complaints/${c.video}`}
                          type="video/mp4"
                        />
                      </video>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === page}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default ComplaintDashboard;
