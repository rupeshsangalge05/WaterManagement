import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Row, Col, Card, Button, ListGroup, Alert, Spinner,
  Modal, Form,
  Badge,
  Table
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:5000/user';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionHistory, setConnectionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [paying, setPaying] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, billsRes, connRes, historyRes, payRes] = await Promise.all([
          axios.get(`${API_BASE}/profile`, { headers }),
          axios.get(`${API_BASE}/bills`, { headers }),
          axios.get(`${API_BASE}/connections`, { headers }),
          axios.get(`${API_BASE}/connectionHistory`, { headers }),
          axios.get(`${API_BASE}/payments`, { headers })
        ]);

        setUser(profileRes.data);
        setBills(billsRes.data);
        setConnections(connRes.data);
        setConnectionHistory(historyRes.data);
        setPayments(payRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user data. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openPaymentModal = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const closePaymentModal = () => {
    setSelectedBill(null);
    setShowModal(false);
  };

  const handlePayment = async (index) => {
    const bill = bills[index];
    setPaying(prev => ({ ...prev, [index]: true }));

    try {
      const transactionId = uuidv4();
      const paymentMethod = 'Online Banking';

      const res = await axios.post(`${API_BASE}/pay`, {
        billId: bill._id, transactionId, paymentMethod
      }, { headers });

      const { paidBill, paymentHistory } = res.data;

      const updatedBills = [...bills];
      updatedBills[index] = paidBill;
      setBills(updatedBills);
      setPayments(paymentHistory);

      setSuccessMessage(`✅ ₹${bill.amount} paid successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setError('❌ Payment failed. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setPaying(prev => ({ ...prev, [index]: false }));
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" />
      <div>Loading your dashboard...</div>
    </div>
  );

  return (
    // <Container className="py-5 mt-5">
    //   <h2 className="mb-3">👋 Welcome, {user?.fullName}</h2>
    //   <div className='w-100 bg-light'>
    //     <p className="text-muted">
    //       <strong>Email:</strong> {user?.email} | <strong>Role:</strong> {user?.role} <br />
    //       <strong>Phone:</strong> {user?.contact} | <strong>Address:</strong> {user?.address} <br />
    //       <strong>Connection Status:</strong> {user?.connectionStatus}
    //     </p>
    //   </div>

    //   {successMessage && <Alert variant="success">{successMessage}</Alert>}
    //   {error && <Alert variant="danger">{error}</Alert>}

    //   <Row className="mt-4">
    //     {/* Bills */}
    //     <Col md={6}>
    //       <Card className="mb-4 shadow-sm">
    //         <Card.Header>📄 Your Bills</Card.Header>
    //         <ListGroup variant="flush">
    //           {bills.length ? bills.map((bill, index) => (
    //             <ListGroup.Item key={bill._id} className="d-flex justify-content-between align-items-center">
    //               <div>
    //                 <strong>₹{bill.amount}</strong><br />
    //                 Due: {new Date(bill.dueDate).toLocaleDateString()}<br />
    //                 <span className={bill.status === 'PAID' ? 'text-success' : 'text-danger'}>
    //                   {bill.status}
    //                 </span>
    //               </div>
    //               {bill.status !== 'PAID' ? (
    //                 <Button
    //                   size="sm"
    //                   variant="success"
    //                   onClick={() => openPaymentModal(bill)}
    //                 >
    //                   Pay Now
    //                 </Button>
    //               ) : <span>✅ Paid</span>}
    //             </ListGroup.Item>
    //           )) : <ListGroup.Item>No bills available</ListGroup.Item>}
    //         </ListGroup>
    //       </Card>
    //     </Col>

    //     {/* Payments */}
    //     <Col md={6}>
    //       <Card className="mb-4 shadow-sm">
    //         <Card.Header>💳 Payment History</Card.Header>
    //         <ListGroup variant="flush">
    //           {payments.length ? payments.map((p, i) => (
    //             <ListGroup.Item key={i}>
    //               ₹{p.amount} | {new Date(p.paymentDate).toLocaleDateString()} <br />
    //               Method: {p.paymentMethod}
    //             </ListGroup.Item>
    //           )) : <ListGroup.Item>No payments yet</ListGroup.Item>}
    //         </ListGroup>
    //       </Card>
    //     </Col>
    //   </Row>

    //   {/* Payment Modal */}
    //   <Modal show={showModal} onHide={closePaymentModal} centered>
    //     <Modal.Header closeButton>
    //       <Modal.Title>Confirm Payment</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       {selectedBill && (
    //         <>
    //           <p><strong>Bill Amount:</strong> ₹{selectedBill.amount}</p>
    //           <p><strong>Due Date:</strong> {new Date(selectedBill.dueDate).toLocaleDateString()}</p>
    //           <p><strong>Status:</strong> {selectedBill.status}</p>

    //           <Form.Group className="mt-3">
    //             <Form.Label>Payment Method</Form.Label>
    //             <Form.Select disabled>
    //               <option>Online Banking</option>
    //               {/* <option>Online Banking</option> */}
    //             </Form.Select>
    //           </Form.Group>
    //         </>
    //       )}
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="secondary" onClick={closePaymentModal}>Cancel</Button>
    //       <Button
    //         variant="primary"
    //         onClick={() => {
    //           const index = bills.findIndex(b => b._id === selectedBill._id);
    //           handlePayment(index);
    //           closePaymentModal();
    //         }}
    //       >
    //         Confirm & Pay ₹{selectedBill?.amount}
    //       </Button>
    //     </Modal.Footer>
    //   </Modal>
    // </Container>

    // <Container className="py-5 mt-5">
    //   <h2 className="mb-3 fw-bold">
    //     👋 Welcome, <span className="text-primary">{user?.fullName}</span>
    //   </h2>

    //   <Card className="mb-4 shadow-sm">
    //     <Card.Body className="bg-light d-flex justify-content-evenly">
    //       <p className="mb-2">
    //         <strong>Email:</strong> {user?.email} 
    //       </p>
    //       <p className="mb-2">
    //         <strong>Role:</strong> {user?.role}
    //       </p>
    //       <p className="mb-2">
    //         <strong>Phone:</strong> {user?.contact} 
    //       </p>
    //       <p className="mb-2">
    //         <strong>Address:</strong> {user?.address}
    //       </p>
    //       <p className="mb-0">
    //         <strong>Connection Status:</strong>{" "}
    //         <Badge bg={user?.connectionStatus === 'APPROVED' ? "success" : "secondary"}>
    //           {user?.connectionStatus}
    //         </Badge>
    //       </p>
    //     </Card.Body>
    //   </Card>

    //   {successMessage && <Alert variant="success">{successMessage}</Alert>}
    //   {error && <Alert variant="danger">{error}</Alert>}

    //   <Row>
    //     <Col lg={6} className="mb-4">
    //       <Card className="shadow-sm h-100">
    //         <Card.Header className="bg-primary text-white">
    //           📄 Your Bills
    //         </Card.Header>
    //         <ListGroup variant="flush">
    //           {bills.length ? bills.map((bill) => (
    //             <ListGroup.Item
    //               key={bill._id}
    //               className="d-flex justify-content-between align-items-center"
    //             >
    //               <div>
    //                 <strong>₹{bill.amount}</strong><br />
    //                 Due: {new Date(bill.dueDate).toLocaleDateString()}<br />
    //                 <Badge bg={bill.status === 'PAID' ? "success" : "danger"}>
    //                   {bill.status}
    //                 </Badge>
    //               </div>
    //               {bill.status !== 'PAID' ? (
    //                 <Button
    //                   size="sm"
    //                   variant="outline-success"
    //                   onClick={() => openPaymentModal(bill)}
    //                 >
    //                   Pay Now
    //                 </Button>
    //               ) : (
    //                 <span>✅ Paid</span>
    //               )}
    //             </ListGroup.Item>
    //           )) : (
    //             <ListGroup.Item>No bills available</ListGroup.Item>
    //           )}
    //         </ListGroup>
    //       </Card>
    //     </Col>

    //     <Col lg={6} className="mb-4">
    //       <Card className="shadow-sm h-100">
    //         <Card.Header className="bg-success text-white">
    //           💳 Payment History
    //         </Card.Header>
    //         <ListGroup variant="flush">
    //           {payments.length ? payments.map((p, i) => (
    //             <ListGroup.Item key={i}>
    //               ₹{p.amount} | {new Date(p.paymentDate).toLocaleDateString()}<br />
    //               Method: {p.paymentMethod}
    //             </ListGroup.Item>
    //           )) : (
    //             <ListGroup.Item>No payments yet</ListGroup.Item>
    //           )}
    //         </ListGroup>
    //       </Card>
    //     </Col>
    //   </Row>

    //   <Modal show={showModal} onHide={closePaymentModal} centered>
    //     <Modal.Header closeButton>
    //       <Modal.Title>🧾 Confirm Payment</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       {selectedBill && (
    //         <>
    //           <p><strong>Bill Amount:</strong> ₹{selectedBill.amount}</p>
    //           <p><strong>Due Date:</strong> {new Date(selectedBill.dueDate).toLocaleDateString()}</p>
    //           <p><strong>Status:</strong> {selectedBill.status}</p>

    //           <Form.Group className="mt-3">
    //             <Form.Label>Payment Method</Form.Label>
    //             <Form.Select disabled>
    //               <option>Online Banking</option>
    //             </Form.Select>
    //           </Form.Group>
    //         </>
    //       )}
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="outline-secondary" onClick={closePaymentModal}>
    //         Cancel
    //       </Button>
    //       <Button
    //         variant="primary"
    //         onClick={() => {
    //           const index = bills.findIndex(b => b._id === selectedBill._id);
    //           handlePayment(index);
    //           closePaymentModal();
    //         }}
    //       >
    //         Confirm & Pay ₹{selectedBill?.amount}
    //       </Button>
    //     </Modal.Footer>
    //   </Modal>
    // </Container>

    <Container className="py-5 mt-5">
      {/* Welcome Message */}
      <h2 className="mb-3 fw-bold">
        👋 Welcome, <span className="text-primary">{user?.fullName}</span>
      </h2>

      {/* User Info */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="bg-light">
          <p className="mb-2">
            <strong>Email:</strong> {user?.email} &nbsp;|&nbsp;
            <strong>Role:</strong> {user?.role}
          </p>
          <p className="mb-2">
            <strong>Phone:</strong> {user?.contact} &nbsp;|&nbsp;
            <strong>Address:</strong> {user?.address}
          </p>
          <p className="mb-0">
            <strong>Connection Status:</strong>{" "}
            <Badge bg={user?.connectionStatus === 'Active' ? "success" : "secondary"}>
              {user?.connectionStatus}
            </Badge>
          </p>
        </Card.Body>
      </Card>

      {/* Alerts */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Bills & Payments */}
      <Row>
        {/* Bills Section */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              📄 Your Bills
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive bordered hover className="mb-0">
                <thead className="table-light text-center">
                  <tr>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.length ? bills.map((bill) => (
                    <tr key={bill._id} className="text-center align-middle">
                      <td>₹{bill.amount}</td>
                      <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={bill.status === 'PAID' ? "success" : "danger"}>
                          {bill.status}
                        </Badge>
                      </td>
                      <td>
                        {bill.status !== 'PAID' ? (
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => openPaymentModal(bill)}
                          >
                            Pay Now
                          </Button>
                        ) : (
                          <span>✅ Paid</span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center">No bills available</td></tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Payment History */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-success text-white">
              💳 Payment History
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive bordered hover className="mb-0">
                <thead className="table-light text-center">
                  <tr>
                    <th>Amount</th>
                    <th>Payment Date</th>
                    <th>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length ? payments.map((p, i) => (
                    <tr key={i} className="text-center">
                      <td>₹{p.amount}</td>
                      <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td>{p.paymentMethod}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="text-center">No payments yet</td></tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payment Modal */}
      <Modal show={showModal} onHide={closePaymentModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>🧾 Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBill && (
            <>
              <p><strong>Bill Amount:</strong> ₹{selectedBill.amount}</p>
              <p><strong>Due Date:</strong> {new Date(selectedBill.dueDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedBill.status}</p>

              <Form.Group className="mt-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select disabled>
                  <option>Online Banking</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closePaymentModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const index = bills.findIndex(b => b._id === selectedBill._id);
              handlePayment(index);
              closePaymentModal();
            }}
          >
            Confirm & Pay ₹{selectedBill?.amount}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserDashboard;
