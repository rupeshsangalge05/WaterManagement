import { useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const GenerateBillModal = ({ show, onHide, connection, units, setUnits, billAmount, setBillAmount, dueDate, setDueDate, onSubmit }) => { 
  const ratePerUnit = 10;

  useEffect(() => {
    // Only calculate bill amount if units is a valid number
    if (units && !isNaN(units) && units > 0) {
      setBillAmount(units * ratePerUnit);
    } else {
      setBillAmount('');
    }
  }, [units]);

  const isSubmitDisabled = !units || !billAmount || !dueDate || isNaN(billAmount);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Generate Bill for {connection?.fullName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Water Usage (Units)</Form.Label>
          <Form.Control
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            placeholder="Enter units used"
            min={0}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amount (Rs.)</Form.Label>
          <Form.Control type="text" value={billAmount} disabled readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}> Cancel </Button>
        <Button variant="primary" onClick={onSubmit} disabled={isSubmitDisabled}> Generate Bill </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GenerateBillModal;
