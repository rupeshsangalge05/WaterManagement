import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [formData, setFormData] = useState({ day: "", morning: "", wardNo: "" });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });

  const fetchTimetables = async () => {
    try {
      const response = await axios.get("http://localhost:5000/timetable");
      setTimetables(response.data);
    } catch (error) {
      showAlert("Error fetching timetable", "danger");
      console.error("Error fetching timetable:", error);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ ...alert, show: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/timetable/${editingId}`, formData);
        showAlert("Timetable updated successfully!");
      } else {
        await axios.post("http://localhost:5000/timetable", formData);
        showAlert("Timetable added successfully!");
      }
      setFormData({ day: "", morning: "", wardNo: "" });
      setEditingId(null);
      fetchTimetables();
    } catch (error) {
      showAlert("Error saving timetable", "danger");
      console.error("Error saving timetable:", error);
    }
  };

  const handleEdit = (entry) => {
    setFormData(entry);
    setEditingId(entry._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this timetable entry?")) {
      try {
        await axios.delete(`http://localhost:5000/timetable/${id}`);
        showAlert("Timetable deleted successfully!");
        fetchTimetables();
      } catch (error) {
        showAlert("Error deleting timetable", "danger");
        console.error("Error deleting timetable:", error);
      }
    }
  };

  return (
    <section id="timetable" className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <Container>
        <h2 className="text-center mb-4 text-primary text-uppercase">Water Supply Timetable</h2>

        {/* Alert Messages */}
        {alert.show && (
          <Alert 
            variant={alert.variant} 
            onClose={() => setAlert({...alert, show: false})} 
            dismissible
            className="mt-3"
          >
            {alert.message}
          </Alert>
        )}

        {/* Form for Add / Edit */}
        <Form onSubmit={handleSubmit} className="border p-3 rounded border-primary mb-3">
          <Row className="mb-3">
            <Col md={3} className="mb-2 mb-md-0">
              <Form.Control
                placeholder="Day"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                required
              />
            </Col>
            <Col md={3} className="mb-2 mb-md-0">
              <Form.Control
                placeholder="Timing Slot"
                value={formData.morning}
                onChange={(e) => setFormData({ ...formData, morning: e.target.value })}
                required
              />
            </Col>
            <Col md={3} className="mb-2 mb-md-0">
              <Form.Control
                placeholder="Ward Number"
                value={formData.wardNo}
                onChange={(e) => setFormData({ ...formData, wardNo: e.target.value })}
                required
              />
            </Col>
            <Col md={3} className="mb-2 mb-md-0">
              <Button type="submit">{editingId ? "Update" : "Add"}</Button>
            </Col>
          </Row>
        </Form>

        {/* Table */}
        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: "#0d6efd", color: "white", textAlign: "center" }}>
            <tr>
              <th>Day</th>
              <th>Timing Slot</th>
              <th>Ward Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetables.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.day}</td>
                <td>{entry.morning}</td>
                <td>{entry.wardNo}</td>
                <td className="text-center">
                  <Button size="sm" variant="warning" onClick={() => handleEdit(entry)} className="me-2">
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(entry._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </section>
  );
};

export default Timetable;