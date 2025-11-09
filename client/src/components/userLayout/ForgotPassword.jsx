import React, { useState } from 'react'
import { Button, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.put(`http://localhost:5000/user/forgotPassword/${email}`)

            if (response.status === 200) {
                alert(response.data?.message);
                navigate('/login')
            } else {
                setError(response.data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setError(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='pt-5 mt-5'>
            <Container className='border border-5  p-3 w-75'>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Please Enter Email here</Form.Label>
                        <Form.Control
                            placeholder='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" // Validate email format
                            required
                        />

                        <Form.Control.Feedback type="invalid">
                            Please enter correct email
                        </Form.Control.Feedback>
                    </Form.Group>

                    {error && <div className="text-danger">{error}</div>}
                    {successMessage && <div className="text-success">{successMessage}</div>}

                    <Row className='pb-4 pt-3'>
                        <Button
                            className='mx-auto' //Allow to align button in center
                            style={{ width: '150px' }} //defining width of the button
                            variant="primary" type="submit" block disabled={loading || !email}>
                            {loading ? 'Processing...' : 'Submit'}
                        </Button>
                    </Row>
                </Form>
            </Container>
        </div>
    )
}

export default ForgotPassword;
