// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Table, Button, Modal, Spinner, Container } from "react-bootstrap";

// const EmployeeUserView = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/employee/viewUsers")
//       .then((res) => setUsers(res.data))
//       .catch((err) => {
//         console.error("Failed to fetch users", err);
//         setUsers([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const handleShowModal = (user) => {
//     setSelectedUser(user);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedUser(null);
//     setShowModal(false);
//   };

//   if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

//   return (
//     <div className="p-5 mt-5">
//       <Container className="p-5 border border-danger-subtle rounded shadow">
//         {/* <h4 className="mb-4">All Users</h4> */}
//         <h4 className="mb-4">Dashboard</h4>
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Contact</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length === 0 ? (
//               <tr>
//                 <td colSpan="6">No users found.</td>
//               </tr>
//             ) : (
//               users.map((user, index) => (
//                 <tr key={user._id}>
//                   <td>{index + 1}</td>
//                   <td>{user.fullName}</td>
//                   <td>{user.email}</td>
//                   <td>{user.contact}</td>
//                   <td>{user.connectionStatus}</td>
//                   <td>
//                     <Button variant="primary" size="sm" onClick={() => handleShowModal(user)}>
//                       View
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </Table>

//         {/* Modal for User Details */}
//         <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
//           <Modal.Header closeButton>
//             <Modal.Title>User Details</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedUser && (
//               <>
//                 <h5>{selectedUser.fullName}</h5>
//                 <Table bordered>
//                   <tbody>
//                     <tr>
//                       <th>Email</th>
//                       <td>{selectedUser.email}</td>
//                     </tr>
//                     <tr>
//                       <th>Contact</th>
//                       <td>{selectedUser.contact}</td>
//                     </tr>
//                     <tr>
//                       <th>Gender</th>
//                       <td>{selectedUser.gender}</td>
//                     </tr>
//                     <tr>
//                       <th>Address</th>
//                       <td>
//                       Address {selectedUser.address}, Street {selectedUser.street}, Ward {selectedUser.wardNo}, House No {selectedUser.houseNo}
//                       </td>
//                     </tr>
//                     <tr>
//                       <th>Status</th>
//                       <td>{selectedUser.connectionStatus}</td>
//                     </tr>
//                     <tr>
//                       <th>Role</th>
//                       <td>{selectedUser.role}</td>
//                     </tr>
//                     <tr>
//                       <th>Created At</th>
//                       <td>{new Date(selectedUser.createdAt).toLocaleString()}</td>
//                     </tr>
//                   </tbody>
//                 </Table>

//                 <h5 className="mt-4">Bills</h5>
//                 {selectedUser.bills?.length > 0 ? (
//                   <Table size="sm" striped bordered>
//                     <thead>
//                       <tr>
//                         <th>#</th>
//                         <th>Due Date </th>
//                         <th>Units</th>
//                         <th>Amount</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedUser.bills.map((bill, idx) => (
//                         <tr key={idx}>
//                           <td>{idx + 1}</td>
//                           <td>{new Date(bill.dueDate).toLocaleString() || 'N/A'}</td>
//                           <td>{bill.units || 'N/A'}</td>
//                           <td>{bill.amount || 'N/A'}</td>
//                           <td>{bill.status || 'N/A'}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 ) : (
//                   <p>No bills found.</p>
//                 )}

//                 <h5 className="mt-4">Payment History</h5>
//                 {selectedUser.paymentHistory?.length > 0 ? (
//                   <Table size="sm" striped bordered>
//                     <thead>
//                       <tr>
//                         <th>#</th>
//                         <th>Amount Paid</th>
//                         <th>Due Date</th>
//                         <th>Payment Date</th>
//                         <th>Mode</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedUser.paymentHistory.map((payment, idx) => (
//                         <tr key={idx}>
//                           <td>{idx + 1}</td>
//                           <td>{payment.amount || 'N/A'}</td>
//                           <td>{new Date(payment.dueDate).toLocaleString() || 'N/A'}</td>
//                           <td>{new Date(payment.paymentDate).toLocaleString() || 'N/A'}</td>
//                           <td>{payment.paymentMethod || 'N/A'}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 ) : (
//                   <p>No payment history found.</p>
//                 )}
//               </>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </div>
//   );
// };

// export default EmployeeUserView;














import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { Table, Button, Modal, Spinner, Container, Alert, Form, Pagination } from "react-bootstrap";

const PAGE_SIZE = 10;

const EmployeeUserView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // IMPORTANT: original code called this with plain axios and no
    // Authorization header at all. Either the backend route is
    // unprotected (meaning anyone can pull every user's contact info,
    // bills, and payment history with no auth — verify this first,
    // before anything else) or it's been silently 401ing. `api` attaches
    // the token automatically; confirm the backend actually checks it.
    api.get("/employee/viewUsers")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        // Original code swallowed this into an empty array, which is
        // indistinguishable from "genuinely zero users" in the UI.
        // That's a debugging trap, not just a UX gap.
        setError(err.response?.data?.message || "Failed to fetch users");
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.contact?.toLowerCase?.().includes(q)
    );
  }, [users, search]);

  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div className="p-5 mt-5">
      <Container className="p-5 border border-danger-subtle rounded shadow">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h4 className="mb-0">Dashboard</h4>
          <Form.Control
            type="text"
            placeholder="Search by name, email, or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '320px' }}
          />
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan="6">{error ? 'Could not load users.' : 'No users found.'}</td>
              </tr>
            ) : (
              pageItems.map((user, index) => (
                <tr key={user._id}>
                  <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.contact}</td>
                  <td>{user.connectionStatus}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleShowModal(user)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {totalPages > 1 && (
          <Pagination className="justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}

        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <>
                <h5>{selectedUser.fullName}</h5>
                <Table bordered>
                  <tbody>
                    <tr><th>Email</th><td>{selectedUser.email}</td></tr>
                    <tr><th>Contact</th><td>{selectedUser.contact}</td></tr>
                    <tr><th>Gender</th><td>{selectedUser.gender}</td></tr>
                    <tr>
                      <th>Address</th>
                      <td>
                        Address {selectedUser.address}, Street {selectedUser.street}, Ward {selectedUser.wardNo}, House No {selectedUser.houseNo}
                      </td>
                    </tr>
                    <tr><th>Status</th><td>{selectedUser.connectionStatus}</td></tr>
                    <tr><th>Role</th><td>{selectedUser.role}</td></tr>
                    <tr><th>Created At</th><td>{new Date(selectedUser.createdAt).toLocaleString()}</td></tr>
                  </tbody>
                </Table>

                <h5 className="mt-4">Bills</h5>
                {selectedUser.bills?.length > 0 ? (
                  <Table size="sm" striped bordered>
                    <thead>
                      <tr><th>#</th><th>Due Date</th><th>Units</th><th>Amount</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {selectedUser.bills.map((bill, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{bill.dueDate ? new Date(bill.dueDate).toLocaleString() : 'N/A'}</td>
                          <td>{bill.units || 'N/A'}</td>
                          <td>{bill.amount || 'N/A'}</td>
                          <td>{bill.status || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No bills found.</p>
                )}

                <h5 className="mt-4">Payment History</h5>
                {selectedUser.paymentHistory?.length > 0 ? (
                  <Table size="sm" striped bordered>
                    <thead>
                      <tr><th>#</th><th>Amount Paid</th><th>Due Date</th><th>Payment Date</th><th>Mode</th></tr>
                    </thead>
                    <tbody>
                      {selectedUser.paymentHistory.map((payment, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{payment.amount || 'N/A'}</td>
                          <td>{payment.dueDate ? new Date(payment.dueDate).toLocaleString() : 'N/A'}</td>
                          <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'N/A'}</td>
                          <td>{payment.paymentMethod || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No payment history found.</p>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default EmployeeUserView;
