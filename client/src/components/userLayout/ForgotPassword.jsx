// import React, { useState } from 'react'
// import { Button, Container, Form, Row } from 'react-bootstrap';
// import axios from 'axios';

// import { useNavigate } from 'react-router-dom';

// const ForgotPassword = () => {
//     const navigate = useNavigate();

//     const [email, setEmail] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         setSuccessMessage(null);

//         try {
//             const response = await axios.put(`http://localhost:5000/user/forgotPassword/${email}`)

//             if (response.status === 200) {
//                 alert(response.data?.message);
//                 navigate('/login')
//             } else {
//                 setError(response.data.message || 'An error occurred. Please try again.');
//             }
//         } catch (error) {
//             setError(error.response?.data?.message);
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className='pt-5 mt-5'>
//             <Container className='border border-5  p-3 w-75'>
//                 <Form onSubmit={handleSubmit}>
//                     <Form.Group>
//                         <Form.Label>Please Enter Email here</Form.Label>
//                         <Form.Control
//                             placeholder='email'
//                             name='email'
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             type="email" // Validate email format
//                             required
//                         />

//                         <Form.Control.Feedback type="invalid">
//                             Please enter correct email
//                         </Form.Control.Feedback>
//                     </Form.Group>

//                     {error && <div className="text-danger">{error}</div>}
//                     {successMessage && <div className="text-success">{successMessage}</div>}

//                     <Row className='pb-4 pt-3'>
//                         <Button
//                             className='mx-auto' //Allow to align button in center
//                             style={{ width: '150px' }} //defining width of the button
//                             variant="primary" type="submit" block disabled={loading || !email}>
//                             {loading ? 'Processing...' : 'Submit'}
//                         </Button>
//                     </Row>
//                 </Form>
//             </Container>
//         </div>
//     )
// }

// export default ForgotPassword;





import React, { useState } from 'react'
import { Button, Container, Form, Row, Alert } from 'react-bootstrap';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // BUG FIX: original sent the email as a raw URL path segment via
      // PUT (`/user/forgotPassword/${email}`), unencoded. That breaks
      // on emails with special characters, and — more importantly —
      // puts a user's email address in every server access log, proxy
      // log, and browser history entry along the way. POST + body is
      // the correct place for this, and it's also what the employee
      // version of this form now does — keep the convention consistent
      // across the app.
      const response = await api.post('/user/forgotPassword', { email });
      alert(response.data?.message || 'Reset token sent — check your email.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pt-5 mt-5'>
      <Container className='border border-5 p-3 w-75'>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Please Enter Email here</Form.Label>
            <Form.Control
              placeholder='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </Form.Group>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          <Row className='pb-4 pt-3'>
            <Button
              className='mx-auto'
              style={{ width: '150px' }}
              variant="primary" type="submit" disabled={loading || !email}>
              {loading ? 'Processing...' : 'Submit'}
            </Button>
          </Row>
        </Form>
      </Container>
    </div>
  )
}

export default ForgotPassword;
