import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Row, Col, Image, Spinner, Table, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";
const MIN_FILES = 2;
const MAX_FILES = 2;

const WaterSourceForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentPhotoType, setCurrentPhotoType] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState({});
  const [waterSources, setWaterSources] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSourceId, setCurrentSourceId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue, } 
        = useForm({ defaultValues: { sourceName: "", sourceAddress: "", capacity: "", storage: "", picOne: "", picTwo: "", }, });

  useEffect(() => {
    fetchWaterSources();
    return () => {
      Object.values(photoPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoPreviews]);

  const fetchWaterSources = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/waterSources`);
      setWaterSources(response.data || []);
    } catch (error) {
      setError("Failed to fetch water sources.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (!file || !currentPhotoType) return;

    if (files.some((f) => f.photoType === currentPhotoType)) {
      setError(`Photo type '${currentPhotoType}' already added.`);
      return;
    }

    if (files.length >= MAX_FILES) {
      setError(`Only ${MAX_FILES} photos allowed.`);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      setError("Invalid file. Only JPG/PNG and <5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFiles([...files, { photoType: currentPhotoType, fileObject: file, previewUrl }]);
    setPhotoPreviews((prev) => ({ ...prev, [currentPhotoType]: previewUrl }));
    setValue(currentPhotoType, file.name, { shouldValidate: true });
    setCurrentPhotoType("");
    e.target.value = null;
  };

  const handleRemovePhoto = (index) => {
    const removed = files[index];
    URL.revokeObjectURL(removed.previewUrl);
    setFiles(files.filter((_, i) => i !== index));
    setValue(removed.photoType, "", { shouldValidate: true });
    setPhotoPreviews((prev) => {
      const copy = { ...prev };
      delete copy[removed.photoType];
      return copy;
    });
  };

  const onSubmit = async (data) => {
    if (files.length < MIN_FILES && !isEditMode) {
      setError("Upload both required photos.");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k !== "picOne" && k !== "picTwo") formData.append(k, v || "");
    });

    const photoTypes = [];
    files.forEach((file) => {
      formData.append("photos", file.fileObject);
      photoTypes.push(file.photoType);
    });

    formData.append("photoTypes", JSON.stringify(photoTypes));
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/waterSources${isEditMode ? `/${currentSourceId}` : ""}`;
      const method = isEditMode ? "put" : "post";
      const response = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(`Water source ${isEditMode ? "updated" : "added"} successfully.`);
        fetchWaterSources();
        resetForm();
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setFiles([]);
    setPhotoPreviews({});
    setCurrentPhotoType("");
    setIsEditMode(false);
    setCurrentSourceId(null);
  };

  const handleEdit = (source) => {
    setValue("sourceName", source.sourceName);
    setValue("sourceAddress", source.sourceAddress);
    setValue("capacity", source.capacity);
    setValue("storage", source.storage);

    if (source.photos && source.photos.length > 0) {
      const newFiles = source.photos.map((photo) => ({
        photoType: photo.photoType,
        filename: photo.filename,
        previewUrl: `${API_BASE_URL}/uploads/water-sources/${photo.filename}`,
      }));
      setFiles(newFiles);
      source.photos.forEach((photo) => setValue(photo.photoType, photo.filename));
    }

    setIsEditMode(true);
    setCurrentSourceId(source._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (source) => {
    setSourceToDelete(source);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sourceToDelete) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/waterSources/${sourceToDelete._id}`);
      setSuccessMessage("Water source deleted.");
      fetchWaterSources();
    } catch {
      setError("Failed to delete source.");
    } finally {
      setShowDeleteModal(false);
      setLoading(false);
      setSourceToDelete(null);
    }
  };

  const cardStyle = {
    transition: "transform 0.3s, box-shadow 0.3s",
    border: "1px solid #dee2e6",
    borderRadius: "10px",
  };

  const cardHoverStyle = {
    transform: "scale(1.02)",
    boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.15)",
  };

  return (
    <div className="mt-5 mb-5 px-3 py-3">
      <Container className="p-4 border rounded shadow-sm">
        <h3 className="text-center mb-4">{isEditMode ? "Edit Water Source" : "Add Water Source"}</h3>

        {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
        {successMessage && <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>{successMessage}</Alert>}

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="mb-4">
            <legend>Source Details</legend>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Source Name</Form.Label>
                <Form.Control isInvalid={!!errors.sourceName} {...register("sourceName", { required: "Required" })} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Address</Form.Label>
                <Form.Control isInvalid={!!errors.sourceAddress} {...register("sourceAddress", { required: "Required" })} /></Form.Group></Col>
            </Row>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Capacity (liters/day)</Form.Label>
                <Form.Control isInvalid={!!errors.capacity} {...register("capacity", { required: "Required" })} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Storage Capacity</Form.Label>
                <Form.Control isInvalid={!!errors.storage} {...register("storage", { required: "Required" })} /></Form.Group></Col>
            </Row>
          </fieldset>

          <fieldset>
            <legend>Upload Photos</legend>
            <p className="text-muted small">Required: {MIN_FILES} photos (picOne, picTwo)</p>
            <Row>
              <Col md={5}>
                <Form.Select value={currentPhotoType} onChange={(e) => setCurrentPhotoType(e.target.value)} disabled={loading || files.length >= MAX_FILES}>
                  <option value="">Select Photo Type</option>
                  {!files.some((f) => f.photoType === "picOne") && <option value="picOne">Photo 1</option>}
                  {!files.some((f) => f.photoType === "picTwo") && <option value="picTwo">Photo 2</option>}
                </Form.Select>
              </Col>
              <Col md={7}>
                <Form.Control type="file" accept="image/*" disabled={!currentPhotoType} onChange={handleFileSelection} />
              </Col>
            </Row>

            <Row className="mt-3">
              {files.map((file, idx) => (
                <Col xs={6} md={4} lg={3} key={file.photoType}>
                  <div
                    className="p-2 text-center"
                    style={{ ...cardStyle }}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
                  >
                    <Button variant="danger" size="sm" className="position-absolute top-0 end-0 m-1" onClick={() => handleRemovePhoto(idx)}>&times;</Button>
                    <p className="fw-semibold mb-2">{file.photoType}</p>
                    <Image src={file.previewUrl || file.filename} thumbnail style={{ maxHeight: "130px", width: "auto" }} />
                  </div>
                </Col>
              ))}
            </Row>
          </fieldset>

          <div className="d-flex justify-content-between mt-4">
            {isEditMode && <Button variant="secondary" onClick={resetForm}>Cancel Edit</Button>}
            <Button type="submit" variant={isEditMode ? "warning" : "primary"} disabled={loading || (!isEditMode && files.length < MIN_FILES)}>
              {loading ? <Spinner animation="border" size="sm" /> : isEditMode ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Container>

      {/* Display Table */}
      <Container className="mt-5">
        <h4>Water Sources</h4>
        {waterSources.length === 0 ? <Alert variant="info">No sources found.</Alert> : (
          <Table striped bordered responsive hover className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
                <th>Capacity</th>
                <th>Storage</th>
                <th>Photos</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {waterSources.map((source, index) => (
                <tr key={source._id}>
                  <td>{index + 1}</td>
                  <td>{source.sourceName}</td>
                  <td>{source.sourceAddress}</td>
                  <td>{source.capacity}</td>
                  <td>{source.storage}</td>
                  <td>
                    {source.photos?.map((photo, i) => (
                      <Image key={i} src={`${API_BASE_URL}/uploads/water-sources/${photo.filename}`}  style={{ height: "60px", marginRight: "5px" }} />
                    ))}
                  </td>
                  <td>
                    <Button size="sm" variant="primary" onClick={() => handleEdit(source)} className="me-2">Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteClick(source)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Delete water source "{sourceToDelete?.sourceName}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WaterSourceForm;
