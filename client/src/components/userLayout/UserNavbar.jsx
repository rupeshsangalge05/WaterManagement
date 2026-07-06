// import React, { useState } from 'react';
// import { Navbar, Nav, Container } from 'react-bootstrap';
// import { Link } from 'react-router-dom'; 
// import logo from './water-drop.png';

// const navLinks = [
//   { to: '/user', label: 'Home' },
//   { to: '/user/changePassword', label: 'Change Password' },
//   { to: '/user/complaints', label: 'Complaint' },
//   { to: '/', label: 'Logout' },
// ];

// const AdminNavbar = () => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   const navbarStyle = {
//     backgroundColor: '#1e293b', // slate-900
//     position: 'fixed',
//     width: '100%',
//     zIndex: 1030,
//     top: 0,
//     padding: '0.5rem 1rem',
//     boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)',
//   };

//   const brandStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     color: 'white',
//     fontWeight: 'bold',
//     textDecoration: 'none',
//   };

//   const logoStyle = {
//     width: '45px',
//     marginRight: '10px',
//   };

//   const navLinkStyle = (index) => ({
//     color: '#fff',
//     textDecoration: 'none',
//     backgroundColor: hoveredIndex === index ? '#334155' : 'transparent', // darker slate
//     padding: '8px 14px',
//     margin: '0 5px',
//     borderRadius: '6px',
//     transition: 'background-color 0.3s ease, transform 0.2s',
//     fontWeight: '500',
//     fontSize: '16px',
//     display: 'inline-block',
//   });

//   return (
//     <Navbar expand="lg" style={navbarStyle}>
//       <Container>
//         <Navbar.Brand as={Link} to="/admin" style={brandStyle}>
//           <img src={logo} alt="Logo" style={logoStyle} />
//           User Panel
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbarCollapse" className="border-0">
//           <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
//         </Navbar.Toggle>
//         <Navbar.Collapse id="navbarCollapse">
//           <Nav className="ms-auto">
//             {navLinks.map((link, index) => (
//               <Nav.Link
//                 as={Link}
//                 to={link.to}
//                 key={index}
//                 style={navLinkStyle(index)}
//                 onMouseEnter={() => setHoveredIndex(index)}
//                 onMouseLeave={() => setHoveredIndex(null)}
//               >
//                 {link.label}
//               </Nav.Link>
//             ))}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default AdminNavbar;






import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from './water-drop.png';

const navLinks = [
  { to: '/user', label: 'Home' },
  { to: '/user/changePassword', label: 'Change Password' },
  { to: '/user/complaints', label: 'Complaint' },
];

// Renamed from AdminNavbar — this is the user-facing navbar. The old
// internal name (and the brand link below pointing to /admin) suggests
// this file started as a copy of an actual admin navbar that never got
// fully renamed. If you have a real AdminNavbar elsewhere, diff it
// against this one — there may be more leftover admin-only links.
const UserNavbar = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const navbarStyle = {
    backgroundColor: '#1e293b',
    position: 'fixed',
    width: '100%',
    zIndex: 1030,
    top: 0,
    padding: '0.5rem 1rem',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)',
  };

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    fontWeight: 'bold',
    textDecoration: 'none',
  };

  const logoStyle = { width: '45px', marginRight: '10px' };

  const navLinkStyle = (index) => ({
    color: '#fff',
    textDecoration: 'none',
    backgroundColor: hoveredIndex === index ? '#334155' : 'transparent',
    padding: '8px 14px',
    margin: '0 5px',
    borderRadius: '6px',
    transition: 'background-color 0.3s ease, transform 0.2s',
    fontWeight: '500',
    fontSize: '16px',
    display: 'inline-block',
    cursor: 'pointer',
  });

  return (
    <Navbar expand="lg" style={navbarStyle}>
      <Container>
        {/* BUG FIX: this pointed to "/admin" — a logged-in citizen user
            clicking the logo was sent to the admin landing route. */}
        <Navbar.Brand as={Link} to="/user" style={brandStyle}>
          <img src={logo} alt="Logo" style={logoStyle} />
          User Panel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarCollapse" className="border-0">
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="navbarCollapse">
          <Nav className="ms-auto">
            {navLinks.map((link, index) => (
              <Nav.Link
                as={Link}
                to={link.to}
                key={index}
                style={navLinkStyle(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {link.label}
              </Nav.Link>
            ))}
            <Nav.Link
              onClick={handleLogout}
              style={navLinkStyle('logout')}
              onMouseEnter={() => setHoveredIndex('logout')}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;
