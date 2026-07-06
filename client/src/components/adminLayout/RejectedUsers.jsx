import { useState } from 'react';
import { Table, Badge, Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const RejectedConnections = ({ connections, refreshConnections }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleOpenModal = (conn) => {
    setSelectedConnection(conn);
    setRejectionReason(conn.rejectionReason || '');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedConnection || !rejectionReason.trim()) return;

    try {
      await axios.patch(`http://localhost:5000/admin/connections/reject/${selectedConnection._id}`, {
        reason: rejectionReason,
      });
      setShowModal(false);
      setRejectionReason('');
      refreshConnections(); // refresh parent state
    } catch (error) {
      console.error('Failed to update rejection reason:', error);
    }
  };

  return (
    <div className="table-responsive">
      <h4 className="mb-3">Rejected Connections</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Reason</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {connections.length > 0 ? (
            connections.map(conn => (
              <tr key={conn._id}>
                <td>{conn.fullName}</td>
                <td>{conn.email}</td>
                <td>{conn.contact}</td>
                <td><Badge bg="danger">REJECTED</Badge></td>
                <td>{conn.rejectionReason || '—'}</td>
                {/* <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleOpenModal(conn)}
                  >
                    {conn.rejectionReason ? 'Edit Reason' : 'Add Reason'}
                  </Button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">No rejected connections found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Inline Reject Modal */}
      {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for Rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleSubmit} disabled={!rejectionReason.trim()}>
            Confirm Reject
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default RejectedConnections;
