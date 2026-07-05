// import React, { useEffect, useState } from 'react';
// import { Form, useForm } from 'react-hook-form';
// import { Card, Button, Container, Alert, Badge, Table, Modal } from 'react-bootstrap';

// const MakePayment = ({ userId }) => {
//   const { register, handleSubmit, reset } = useForm();
//   const [bills, setBills] = useState([]);
//   const [message, setMessage] = useState({ text: '', variant: '' });
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedBill, setSelectedBill] = useState(null);

//   useEffect(() => {
//     const fetchBills = async () => {
//       try {
//         const response = await fetch(`/api/bills/user/${userId}`);
//         const data = await response.json();
//         setBills(data);
//       } catch (err) {
//         console.error('Failed to fetch bills', err);
//       }
//     };
//     fetchBills();
//   }, [userId]);

//   const openPaymentModal = (bill) => {
//     setSelectedBill(bill);
//     setShowPaymentModal(true);
//   };

//   const closePaymentModal = () => {
//     setShowPaymentModal(false);
//     reset();
//   };

//   const onSubmitPayment = async (data) => {
//     try {
//       const response = await fetch(`/api/bills/${selectedBill._id}/pay`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       });
//       const result = await response.json();
      
//       setBills(bills.map(bill => 
//         bill._id === selectedBill._id ? result.bill : bill
//       ));
      
//       setMessage({ 
//         text: 'Payment successful!', 
//         variant: 'success' 
//       });
//       closePaymentModal();
//     } catch (err) {
//       setMessage({ 
//         text: 'Payment failed', 
//         variant: 'danger' 
//       });
//     }
//   };

//   const getStatusVariant = (status) => {
//     switch(status) {
//       case 'PAID': return 'success';
//       case 'OVERDUE': return 'danger';
//       default: return 'warning';
//     }
//   };

//   return (
//     <Container className="mt-5 py-5">
//       <h2 className="mb-4">Your Bills</h2>
      
//       {message.text && (
//         <Alert variant={message.variant} onClose={() => setMessage({ text: '', variant: '' })} dismissible>
//           {message.text}
//         </Alert>
//       )}

//       {bills.length === 0 ? (
//         <Alert variant="info">No bills found</Alert>
//       ) : (
//         bills.map(bill => (
//           <Card key={bill._id} className="mb-4">
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <div>
//                 <strong>Bill #:</strong> {bill.billNumber}
//                 <Badge bg={getStatusVariant(bill.status)} className="ms-3">
//                   {bill.status}
//                 </Badge>
//               </div>
//               <div>
//                 <strong>Due:</strong> {new Date(bill.dueDate).toLocaleDateString()}
//               </div>
//             </Card.Header>
//             <Card.Body>
//               <Table striped bordered>
//                 <thead>
//                   <tr>
//                     <th>Description</th>
//                     <th>Quantity</th>
//                     <th>Rate</th>
//                     <th>Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bill.items?.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.description}</td>
//                       <td>{item.quantity}</td>
//                       <td>${item.rate.toFixed(2)}</td>
//                       <td>${(item.quantity * item.rate).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="3" className="text-end"><strong>Total:</strong></td>
//                     <td><strong>${bill.amount.toFixed(2)}</strong></td>
//                   </tr>
//                 </tfoot>
//               </Table>
              
//               {bill.status === 'PAID' && (
//                 <Alert variant="success">
//                   Paid on: {new Date(bill.paymentDate).toLocaleString()}
//                 </Alert>
//               )}
              
//               {bill.status === 'PENDING' && (
//                 <div className="d-grid">
//                   <Button 
//                     variant="primary" 
//                     size="lg"
//                     onClick={() => openPaymentModal(bill)}
//                   >
//                     Pay Now
//                   </Button>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         ))
//       )}

//       {/* Payment Modal */}
//       <Modal show={showPaymentModal} onHide={closePaymentModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Pay Bill #{selectedBill?.billNumber}</Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit(onSubmitPayment)}>
//           <Modal.Body>
//             <Form.Group className="mb-3">
//               <Form.Label>Amount to Pay</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={`$${selectedBill?.amount.toFixed(2)}`}
//                 readOnly
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Payment Method</Form.Label>
//               <Form.Select
//                 {...register("paymentMethod", { required: "Payment method is required" })}
//               >
//                 <option value="">Select payment method</option>
//                 <option value="Credit Card">Credit Card</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//                 <option value="Digital Wallet">Digital Wallet</option>
//               </Form.Select>
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={closePaymentModal}>
//               Cancel
//             </Button>
//             <Button variant="primary" type="submit">
//               Confirm Payment
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </Container>
//   );
// };

// export default MakePayment;








import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Card, Button, Container, Alert, Badge, Table, Modal } from 'react-bootstrap';
import api from '../api';

// IMPORTANT: the original version of this file called
// fetch('/api/bills/user/${userId}') — a relative path with an /api
// prefix, no host, and no auth token. That doesn't match any other
// file in this project (everything else uses axios against
// http://localhost:5000 with a Bearer token). This means one of two
// things: either these routes don't exist on your backend yet, or
// they exist under a completely different prefix than the rest of
// your app. I've rewritten this to match your existing convention as
// the more defensible default, but I'm guessing at the route paths
// (`/user/bills/...`) — confirm against your actual Express routes
// before trusting this file. If the paths are wrong it'll just 404
// cleanly, which is at least easier to debug than the silent
// wrong-origin failure the original version had.
//
// Also worth deciding explicitly: this "Pay Now" flow doesn't talk to
// any real payment gateway — it just PATCHes a bill's status. That's
// fine for a student/demo project, but if this is ever presented as
// working payment collection, it isn't; it's a status toggle with a
// dropdown next to it.
const MakePayment = ({ userId }) => {
  const { register, handleSubmit, reset } = useForm();
  const [bills, setBills] = useState([]);
  const [message, setMessage] = useState({ text: '', variant: '' });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchBills = async () => {
      try {
        const { data } = await api.get(`/user/bills/${userId}`);
        setBills(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch bills', err);
        setMessage({ text: 'Could not load bills', variant: 'danger' });
      }
    };
    fetchBills();
  }, [userId]);

  const openPaymentModal = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    reset();
  };

  const onSubmitPayment = async (data) => {
    try {
      const { data: result } = await api.patch(`/user/bills/${selectedBill._id}/pay`, data);
      setBills(bills.map(bill => bill._id === selectedBill._id ? result.bill : bill));
      setMessage({ text: 'Payment successful!', variant: 'success' });
      closePaymentModal();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Payment failed', variant: 'danger' });
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'OVERDUE': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <Container className="mt-5 py-5">
      <h2 className="mb-4">Your Bills</h2>

      {message.text && (
        <Alert variant={message.variant} onClose={() => setMessage({ text: '', variant: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      {bills.length === 0 ? (
        <Alert variant="info">No bills found</Alert>
      ) : (
        bills.map(bill => (
          <Card key={bill._id} className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Bill #:</strong> {bill.billNumber}
                <Badge bg={getStatusVariant(bill.status)} className="ms-3">{bill.status}</Badge>
              </div>
              <div><strong>Due:</strong> {new Date(bill.dueDate).toLocaleDateString()}</div>
            </Card.Header>
            <Card.Body>
              <Table striped bordered>
                <thead>
                  <tr><th>Description</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  {bill.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>${item.rate?.toFixed(2)}</td>
                      <td>${(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                    <td><strong>${bill.amount?.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>

              {bill.status === 'PAID' && (
                <Alert variant="success">
                  Paid on: {bill.paymentDate ? new Date(bill.paymentDate).toLocaleString() : 'N/A'}
                </Alert>
              )}

              {bill.status === 'PENDING' && (
                <div className="d-grid">
                  <Button variant="primary" size="lg" onClick={() => openPaymentModal(bill)}>
                    Pay Now
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      <Modal show={showPaymentModal} onHide={closePaymentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Pay Bill #{selectedBill?.billNumber}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmitPayment)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Amount to Pay</Form.Label>
              <Form.Control type="text" value={`$${selectedBill?.amount?.toFixed(2) ?? ''}`} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select {...register("paymentMethod", { required: "Payment method is required" })}>
                <option value="">Select payment method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Digital Wallet">Digital Wallet</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closePaymentModal}>Cancel</Button>
            <Button variant="primary" type="submit">Confirm Payment</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default MakePayment;
