import { Table, Badge } from 'react-bootstrap';

const ApprovedEmployees = ({ employees }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Contact</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {employees.length ? (
          employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.fullName}</td>
              <td>{emp.email}</td>
              <td>{emp.contact}</td>
              <td><Badge bg="success">APPROVED</Badge></td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={4} className="text-center">No approved employees</td></tr>
        )}
      </tbody>
    </Table>
  );
};

export default ApprovedEmployees;
