import { useState } from 'react';
import { Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const RejectedEmployees = ({ employees, refreshEmployees }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleOpenModal = (employee) => {
    setCurrentEmployee(employee);
    setRejectionReason(employee.rejectionReason || '');
    setShowRejectModal(true);
  };

  const handleSubmitReason = async () => {
    if (!currentEmployee || !rejectionReason.trim()) return;

    try {
      await axios.patch(`http://localhost:5000/admin/employees/reject/${currentEmployee._id}`, {
        reason: rejectionReason
      });
      setShowRejectModal(false);
      setRejectionReason('');
      refreshEmployees(); // call parent to refresh data
    } catch (error) {
      console.error('Failed to update rejection reason:', error);
    }
  };

  return (
    <div className="table-responsive">
      <h4 className="mb-3">Rejected Employees</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Status</th>
            <th>Reason</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.fullName}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td><Badge bg="danger">REJECTED</Badge></td>
                <td>{emp.rejectionReason || '—'}</td>
                {/* <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleOpenModal(emp)}
                  >
                    {emp.rejectionReason ? 'Edit Reason' : 'Add Reason'}
                  </Button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">No rejected employees found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Inline Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rejection Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Why was the employee rejected?"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleSubmitReason} disabled={!rejectionReason.trim()}>
            Save Reason
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RejectedEmployees;
