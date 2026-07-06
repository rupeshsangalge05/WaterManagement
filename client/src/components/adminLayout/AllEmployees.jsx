import { useState, useEffect } from 'react';
import { Tabs, Tab, Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import PendingEmployees from './PendingEmployees';
import ApprovedEmployees from './ApprovedEmployees';
import RejectedEmployees from './RejectedEmployees';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState({ PENDING: [], APPROVED: [], REJECTED: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pending, approved, rejected] = await Promise.all([
        axios.get('http://localhost:5000/admin/employee/PENDING'),
        axios.get('http://localhost:5000/admin/employee/APPROVED'),
        axios.get('http://localhost:5000/admin/employee/REJECTED'),
      ]);
      setEmployees({
        PENDING: pending.data,
        APPROVED: approved.data,
        REJECTED: rejected.data,
      });
      console.log(pending)
      console.log(approved)
      console.log(rejected)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/admin/employee/approve/${id}`);
      setSuccessMessage(res.data.message);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve employee');
    }
  };

  const handleReject = async () => {
    try {
      const res = await axios.patch(`http://localhost:5000/admin/employee/reject/${currentEmployee._id}`, {
        reason: rejectionReason,
      });
      setSuccessMessage(res.data.message);
      setShowRejectModal(false);
      setRejectionReason('');
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject employee');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className='py-3 mb-5'>
      <Container className="mt-5 p-3 border border-success-subtle rounded">
        <h2>Employee Management</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Tabs defaultActiveKey="PENDING" className="mb-3">
          <Tab eventKey="PENDING" title={`PENDING (${employees.PENDING.length})`}>
            <PendingEmployees
              employees={employees.PENDING}
              onApprove={handleApprove}
              onReject={(emp) => {
                setCurrentEmployee(emp);
                setShowRejectModal(true);
              }}
            />
          </Tab>
          <Tab eventKey="APPROVED" title={`APPROVED (${employees.APPROVED.length})`}>
            <ApprovedEmployees employees={employees.APPROVED} />
          </Tab>
          <Tab eventKey="REJECTED" title={`REJECTED (${employees.REJECTED.length})`}>
            <RejectedEmployees employees={employees.REJECTED} />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default AdminEmployees;
