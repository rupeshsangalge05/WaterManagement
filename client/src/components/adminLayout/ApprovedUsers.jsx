import React, { useState } from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import ViewPaymentsModal from './ViewPaymentsModal'; // Import the modal component
import axios from 'axios'

const ApprovedConnections = ({ connections, onGenerateBill }) => {
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedPaymentHistory, setSelectedPaymentHistory] = useState([]); // Store the bills for the selected user
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userContact, setUserContact] = useState('');


  const paymentStatusVariant = {
    PENDING: 'warning',
    PAID: 'success',
    OVERDUE: 'danger',
    FAILED: 'danger',
  };

  const getPaymentStatusVariant = (status) => paymentStatusVariant[status] || paymentStatusVariant.PENDING;

  // Function to handle "View Payments" button click
  const handleViewPayments = async (userId) => {
    try {
      // Assuming you have an API to fetch the user's bills
      // const response = await axios.get(`http://localhost:5000/admin/user/${userId}/bill`);
      const response = await axios.get(`http://localhost:5000/admin/payments/${userId}`);
      // const data = await response.json();
      console.log(response.data.paymentHistory)
      console.log(response.data)

      if (response.data.paymentHistory) {
        // setSelectedPaymentHistory(response.data.paymentHistory || []); // Set the fetched bills
        // setShowModal(true); // Show the modal
        setSelectedPaymentHistory(response.data.paymentHistory || []);
        setUserName(response.data.fullName || '');
        setUserEmail(response.data.email || '');
        setUserContact(response.data.contact || '');
        setShowModal(true);
      } else {
        alert('Failed to fetch user bills');
      }
    } catch (error) {
      console.error('Error fetching user bills:', error);
    }
  };

  return (
    <div className="table-responsive">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Status</th>
            {/* <th>Payment Status</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {connections.length > 0 ? (
            connections.map((conn) => (
              <tr key={conn._id}>
                <td>{conn.fullName}</td>
                <td>{conn.email}</td>
                <td>{conn.contact}</td>
                <td>
                  <Badge bg="success">APPROVED</Badge>
                </td>
                {/* <td>
                  <Badge bg={getPaymentStatusVariant(conn.paymentStatus)}>
                    {conn.paymentStatus || 'PENDING'}
                  </Badge>
                </td> */}
                <td className="d-flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onGenerateBill(conn)}
                    disabled={conn.paymentStatus === 'PAID'}
                  >
                    {conn.paymentStatus === 'PAID' ? 'Paid' : 'Generate Bill'}
                  </Button>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleViewPayments(conn._id)} // Call function on "View Payments" button click
                  >
                    View Payments
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No approved connections found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ViewPaymentsModal component */}
      {/* <ViewPaymentsModal
        show={showModal} // Pass modal visibility
        onHide={() => setShowModal(false)} // Close the modal
        bills={selectedPaymentHistory} // Pass the selected user's bills
      /> */}
      <ViewPaymentsModal
        show={showModal}
        onHide={() => setShowModal(false)}
        paymentHistory={selectedPaymentHistory}
        userName={userName}
        userEmail={userEmail}
        userContact={userContact}
      />

    </div>
  );
};

export default ApprovedConnections;
