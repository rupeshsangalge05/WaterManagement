import { Table, Button, Badge } from 'react-bootstrap';

const PendingEmployees = ({ employees, onApprove, onReject }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Contact</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.length ? (
          employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.fullName}</td>
              <td>{emp.email}</td>
              <td>{emp.contact}</td>
              <td><Badge bg="warning">PENDING</Badge></td>
              <td>
                <Button size="sm" variant="success" onClick={() => onApprove(emp._id)}>Approve</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => onReject(emp)}>Reject</Button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={5} className="text-center">No pending employees</td></tr>
        )}
      </tbody>
    </Table>
  );
};

export default PendingEmployees;
