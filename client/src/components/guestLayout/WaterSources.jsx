import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  ProgressBar,
  Container,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";

const WaterTankWithBootstrap = () => {
  const [waterSources, setWaterSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWaterSources();
  }, []);

  const fetchWaterSources = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/waterSources`);
      if (response.status === 200) {
        setWaterSources(response.data || []);
      } else {
        setError(`Failed to fetch water sources. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching water sources:", error);
      setError("Failed to fetch water sources. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading water sources...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (waterSources.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">No water sources found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div
        className="text-center mx-auto"
        style={{ maxWidth: "800px", marginBottom: "2rem" }}
      >
        <h4
          style={{
            textTransform: "uppercase",
            color: "#0d6efd",
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
          }}
        >
          Our Water Resources
        </h4>
      </div>

      <Row className="justify-content-center">
        {waterSources.map((source, index) => {
          const percentage = (source.storage / source.capacity) * 100;
          const mainPhoto =
            source.photos?.find((photo) => photo.photoType === "picOne") ||
            (source.photos?.length > 0 ? source.photos[0] : null);

          return (
            <Col
              key={index}
              xs={12}
              sm={10}
              md={6}
              lg={4}
              className="mb-4 d-flex align-items-stretch"
            >
              <Card className="shadow w-100">
                <div
                  style={{
                    position: "relative",
                    height: "230px",
                    overflow: "hidden",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {mainPhoto && (
                    <Image
                      src={`http://localhost:5000/uploads/water-sources/${mainPhoto.filename}`}
                      alt={source.sourceName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.75,
                      }}
                    />
                  )}

                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      backgroundColor: "rgba(13, 110, 253, 0.4)",
                      height: `${percentage}%`,
                      transition: "height 1s ease-in-out",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                      }}
                    >
                      {percentage.toFixed(0)}% Full
                    </div>
                  </div>
                </div>

                <Card.Body>
                  <Card.Title style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                    {source.sourceName}
                  </Card.Title>
                  <Card.Text style={{ fontSize: "0.95rem" }}>
                    <strong>Address:</strong> {source.sourceAddress} <br />
                    <strong>Capacity:</strong> {source.capacity} L <br />
                    <strong>Storage:</strong> {source.storage} L
                  </Card.Text>
                  <ProgressBar
                    now={percentage}
                    label={`${percentage.toFixed(0)}%`}
                    variant="info"
                    animated
                    striped
                    style={{ height: "20px" }}
                  />

                  {source.photos?.length > 1 && (
                    <div className="mt-3">
                      <small className="text-muted">Additional Photos:</small>
                      <div
                        className="d-flex flex-wrap gap-2 mt-2"
                        style={{ maxHeight: "100px", overflowX: "auto" }}
                      >
                        {source.photos.slice(1).map((photo, idx) => (
                          <Image
                            key={idx}
                            src={`http://localhost:5000/uploads/water-sources/${photo.filename}`}
                            thumbnail
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default WaterTankWithBootstrap;
