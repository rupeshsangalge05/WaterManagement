// import React from 'react';
// import { Container, Table } from 'react-bootstrap';

// const Timetable = () => {
//   const schedule = [
//     { day: 'Monday', morning: '6:00 AM - 8:00 AM', wardNo: '1' },
//     { day: 'Tuesday', morning: '6:00 AM - 8:00 AM', wardNo: '2' },
//     { day: 'Wednesday', morning: '7:00 AM - 9:00 AM', wardNo: '3' },
//     { day: 'Thursday', morning: '6:30 AM - 8:30 AM', wardNo: '4' },
//     { day: 'Friday', morning: '6:00 AM - 8:00 AM', wardNo: '5' },
//     { day: 'Saturday', morning: '7:00 AM - 9:00 AM', wardNo: '6' },
//     { day: 'Sunday', morning: '8:00 AM - 10:00 AM', wardNo: '7' },
//   ];

//   const tableStyle = {
//     borderRadius: '1rem',
//     overflow: 'hidden',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//     marginTop: '2rem',
//   };

//   const headerStyle = {
//     backgroundColor: '#0d6efd',
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   };

//   const cellStyle = {
//     textAlign: 'center',
//     verticalAlign: 'middle',
//   };

//   return (
//     <section id="timetable" className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
//       <Container>
//         <h2 className="text-center mb-4 text-primary" style={{
//             textTransform: "uppercase",
//             color: "#0d6efd",
//             fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
//           }}>Water Supply Timetable</h2>
        
//         <div style={tableStyle}>
//           <Table responsive bordered hover className="mb-0">
//             <thead>
//               <tr>
//                 <th style={headerStyle}>Day</th>
//                 <th style={headerStyle}>Morning Slot</th>
//                 <th style={headerStyle}>Ward Number </th>
//               </tr>
//             </thead>
//             <tbody>
//               {schedule.map((entry, index) => (
//                 <tr key={index}>
//                   <td style={cellStyle}>{entry.day}</td>
//                   <td style={cellStyle}>{entry.morning}</td>
//                   <td style={cellStyle}>{entry.wardNo}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default Timetable;




import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const WaterTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get('http://localhost:5000/timetable');
        setTimetable(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch timetable');
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const tableStyle = {
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginTop: '2rem',
  };

  const headerStyle = {
    backgroundColor: '#0d6efd',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const cellStyle = {
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  if (loading) {
    return (
      <section id="timetable" className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading timetable...</p>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section id="timetable" className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <Alert variant="danger">
            {error}
          </Alert>
        </Container>
      </section>
    );
  }

  return (
    <section id="timetable" className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <h2 
          className="text-center mb-4" 
          style={{
            textTransform: "uppercase",
            color: "#0d6efd",
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
          }}
        >
          Water Supply Timetable
        </h2>
        
        {timetable.length === 0 ? (
          <Alert variant="info" className="text-center">
            No timetable data available
          </Alert>
        ) : (
          <div style={tableStyle}>
            <Table responsive bordered hover className="mb-0">
              <thead>
                <tr>
                  <th style={headerStyle}>Day</th>
                  <th style={headerStyle}>Morning Slot</th>
                  <th style={headerStyle}>Ward Number</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((entry, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{entry.day}</td>
                    <td style={cellStyle}>{entry.morning}</td>
                    <td style={cellStyle}>{entry.wardNo}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </section>
  );
};

export default WaterTimetable;