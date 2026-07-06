import { useState, useEffect } from 'react';
import { Tabs, Tab, Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import PendingConnections from './PendingUsers';
import ApprovedConnections from './ApprovedUsers';
import RejectedConnections from './RejectedUsers';
import GenerateBill from './GenerateBill';
import ViewPaymentsModal from './ViewPaymentsModal';

const AdminConnections = () => {
  const [connections, setConnections] = useState({
    PENDING: [],
    APPROVED: [],
    REJECTED: []
  });
  const [units, setUnits] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [currentConnection, setCurrentConnection] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [userPaymentHistory, setUserPaymentHistory] = useState([]);


  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [pending, approved, rejected] = await Promise.all([
        axios.get('http://localhost:5000/admin/user/PENDING'),
        axios.get('http://localhost:5000/admin/user/APPROVED'),
        axios.get('http://localhost:5000/admin/user/REJECTED')
      ]);
      
      setConnections({
        PENDING: pending.data,
        APPROVED: approved.data,
        REJECTED: rejected.data
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch connection data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/admin/user/approve/${id}`);
      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage('', 3000))
      fetchConnections();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve connection');
      setTimeout(() => setError('', 3000))
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/admin/user/reject/${currentConnection._id}`,
        { reason: rejectionReason }
      );
      setSuccessMessage(response.data.message);
      setShowRejectModal(false);
      setRejectionReason('');
      fetchConnections();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject connection');
    }
  };

  const handleGenerateBill = async () => {
    if (isNaN(units) || units <= 0) {
      setError('Please provide a valid number of units.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    const amount = units * 10;
    try {
      const response = await axios.post(`http://localhost:5000/admin/user/${currentConnection._id}/generateBill`,
        { units, dueDate } // Pass units here
      );
      setSuccessMessage(response.data.message);
      setShowBillModal(false);
      setBillAmount(''); // Reset the bill amount
      setDueDate(''); // Reset due date
      setUnits(''); // Reset units
      fetchConnections();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate bill');
    }
  };
  

  const handleViewPayments = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/admin/payments/${userId}`);
      setUserPaymentHistory(response.data.paymentHistory || []);
      setShowPaymentsModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payment history');
    }
  };
  

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className='mt-5 py-3'>
      <Container className="mt-5 p-3 border border-primary-subtle rounded">
        <h2 className="mb-4">User Management</h2>
        
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        {successMessage && <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>{successMessage}</Alert>}
        
        <Tabs defaultActiveKey="PENDING" className="mb-3">
          <Tab eventKey="PENDING" title={`PENDING (${connections.PENDING.length})`}>
            <PendingConnections connections={connections.PENDING} onApprove={handleApprove}
              onReject={(conn) => {
                setCurrentConnection(conn);
                setShowRejectModal(true);
              }}
              error={error} />
          </Tab>
          <Tab eventKey="APPROVED" title={`APPROVED (${connections.APPROVED.length})`}>
            <ApprovedConnections connections={connections.APPROVED} 
              onGenerateBill={(conn) => {
                setCurrentConnection(conn);
                setShowBillModal(true);
              }}
              onViewPayments={handleViewPayments} />
          </Tab>
          <Tab eventKey="REJECTED" title={`REJECTED (${connections.REJECTED.length})`}>
            <RejectedConnections connections={connections.REJECTED} />
          </Tab>
        </Tabs>
        
        <GenerateBill show={showBillModal} onHide={() => setShowBillModal(false)} connection={currentConnection} units={units}
          setUnits={setUnits} billAmount={billAmount} setBillAmount={setBillAmount} dueDate={dueDate} setDueDate={setDueDate}
          onSubmit={() => {
            handleGenerateBill();
            setUnits('');
          }} />

        <ViewPaymentsModal show={showPaymentsModal} onHide={() => setShowPaymentsModal(false)} paymentHistory={userPaymentHistory} />

      </Container>
    </div>
  );
};

export default AdminConnections;

