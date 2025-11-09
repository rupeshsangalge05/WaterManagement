import React from "react";
import { Outlet } from "react-router-dom";
import EmployeeNavbar from "./EmployeeNavbar";
import EmployeeFooter from "./EmployeeFooter";

const EmployeeLayout = () => {
  const layoutStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#e2e8f0", // slate-200
  };

  const contentWrapperStyle = {
    flex: 1,
    width: "100%",
    backgroundColor: "#1e293b", // slate-900
    // display: "flex",
    justifyContent: "center",
    padding: "1rem",
    marginTop:'4rem'
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "1rem",
    // padding: "1.5rem",
    margin: "1rem",
    transition: "transform 0.3s, box-shadow 0.3s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxWidth: "100%",
  };

  const cardHoverStyle = {
    transform: "scale(1.02)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  };

  const handleCardHover = (e, isHovering) => {
    Object.assign(
      e.currentTarget.style,
      isHovering ? cardHoverStyle : cardStyle
    );
  };

  return (
    <div style={layoutStyle}>
      <EmployeeNavbar />

      <div style={contentWrapperStyle}>
        <div
          style={cardStyle}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
        >
          <Outlet />
        </div>
      </div>

      <EmployeeFooter />
    </div>
  );
};

export default EmployeeLayout;
