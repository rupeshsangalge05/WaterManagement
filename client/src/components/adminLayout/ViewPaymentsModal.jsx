// ViewPaymentsModal.jsx
import React, { useState } from 'react';
import { Modal, Table, Button, Badge, Alert } from 'react-bootstrap';

const ViewPaymentsModal = ({ show, onHide, paymentHistory=[], userName, userEmail, userContact }) => {
  // const [userName, setUserName] = useState('');
  // const [userEmail, setUserEmail] = useState('');

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Payment History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Array.isArray(paymentHistory) && paymentHistory.length === 0 ? (
          <p>No payments available.</p>
        ) : (
          <div>
            {/* <Alert variant="info" className="py-1 px-3 d-flex flex-row "> <strong>User: </strong>{userName } | <strong>{''}  Email: </strong>{userEmail}  | <strong> Contact: </strong>{userContact} </Alert>  */}
            <Alert variant="info" className="py-2 px-5 d-flex flex-wrap gap-5">
              <div><strong>User:</strong> {userName}</div><div><strong>Email:</strong> {userEmail}</div><div><strong>Contact:</strong> {userContact}</div>
            </Alert>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Units</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((bill, idx) => (
                  <tr key={idx}>
                    <td>{bill.units}</td>
                    <td>₹{bill.amount}</td>
                    <td><Badge bg={bill.status === 'PAID' ? 'success' : 'warning'}>{bill.status}</Badge></td>
                    <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                    {/* <td>{bill.paymentDate }</td> */}
                    <td>{new Date(bill.paymentDate).toLocaleDateString() }</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewPaymentsModal;
