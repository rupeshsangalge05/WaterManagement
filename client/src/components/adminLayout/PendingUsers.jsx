import { Table, Badge, Button,  Alert } from 'react-bootstrap';

const PendingConnections = ({ connections, onApprove, onReject, error }) => {
  return (
    <div className="table-responsive">
      {/* Display error if it exists */}
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Status</th>
            {/* <th>Date</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {connections.length > 0 ? (
            connections.map(conn => (
              <tr key={conn._id}>
                <td>{conn.fullName}</td>
                <td>{conn.email}</td>
                <td>{conn.contact}</td>
                <td> <Badge bg="warning">PENDING</Badge> </td>
                {/* <td>{new Date(conn.createdAt).toLocaleDateString()}</td> */}
                <td className="d-flex gap-2">
                  <Button variant="success" size="sm" onClick={() => onApprove(conn._id)}>Approve</Button>
                  <Button variant="danger" size="sm" onClick={() => onReject(conn)}>Reject</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                {error ? "Error fetching connections" : "No pending connections found"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PendingConnections;
