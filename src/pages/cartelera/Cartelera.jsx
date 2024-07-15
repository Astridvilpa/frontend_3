import { Navbar, Container, Nav, NavDropdown, Form, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { getAllServices, createService, updateServiceId, deleteServiceById } from "../../services/serviceCall";
import { BsFillPencilFill, BsFillTrash3Fill } from "react-icons/bs";
import { useAuth } from "../../contexts/auth-context/AuthContext"; 
import "./Cartelera.css";

export default function Cartelera() {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editServiceForm, setEditServiceForm] = useState({ service_name: "", description: "" });
  const [newServiceForm, setNewServiceForm] = useState({ service_name: "", description: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { userToken, logout } = useAuth(); 
  const token = userToken?.token;
  const decoded = userToken?.decoded;

  const userRole = useMemo(() => decoded?.userRoleName, [decoded]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices(token);
        if (response.success && Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          console.error("Expected array of services, received:", response);
          setError("Error al obtener servicios: respuesta inesperada.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Error al obtener servicios: ${err.message}`);
      }
    };

    if (token) {
      fetchServices();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleEditServiceClick = (service) => {
    if (editingService === service.id) {
      setEditingService(null);
    } else {
      setEditingService(service.id);
      setEditServiceForm({ id: service.id, service_name: service.service_name || "", description: service.description || "" });
    }
  };

  const handleEditServiceChange = (e) => {
    setEditServiceForm({ ...editServiceForm, [e.target.name]: e.target.value });
  };

  const handleEditServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateServiceId(editServiceForm, token);
      if (response.success) {
        const updatedServices = services.map(service =>
          service.id === editingService ? { ...service, ...editServiceForm } : service
        );
        setServices(updatedServices);
        setEditingService(null);
        console.log("Servicio actualizado con éxito:", response.message);
      } else {
        console.error("Error al actualizar el servicio:", response.message);
      }
    } catch (error) {
      console.error("Error al actualizar el servicio:", error);
    }
  };

  const handleDeleteServiceClick = async (serviceId) => {
    try {
      const response = await deleteServiceById(serviceId, token);
      if (response.success) {
        const updatedServices = services.filter(service => service.id !== serviceId);
        setServices(updatedServices);
        console.log("Servicio eliminado con éxito:", response.message);
      } else {
        console.error("Error al eliminar el servicio:", response.message);
      }
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
  };

  const handleNewServiceChange = (e) => {
    setNewServiceForm({ ...newServiceForm, [e.target.name]: e.target.value });
  };

  const handleNewServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createService(newServiceForm, token);
      if (response.success) {
        const newService = { ...newServiceForm, id: response.data.id }; 
        setServices([...services, newService]);
        setNewServiceForm({ service_name: "", description: "" });
        console.log("Servicio creado con éxito:", response.message);
      } else {
        console.error("Error al crear el servicio:", response.message);
      }
    } catch (error) {
      console.error("Error al crear el servicio:", error);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Navbar.Brand as={Link} to="/profile">Profile</Navbar.Brand>
              <NavDropdown title="Cuenta" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/cartelera">Ver servicios</NavDropdown.Item>
                {userRole === "super_admin" && <NavDropdown.Item as={Link} to="/admin">Ver usuarios</NavDropdown.Item>}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => { logout(); navigate("/login"); }}>Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="admin-design">
        {error && <Alert variant="danger">{error}</Alert>}
        <h2>Servicios Disponibles:</h2>
        {userRole === "super_admin" && (
          <Form onSubmit={handleNewServiceSubmit} className="mb-4">
            <Form.Group controlId="formServiceName">
              <Form.Label>Nombre del Servicio</Form.Label>
              <Form.Control 
                type="text" 
                name="service_name"
                value={newServiceForm.service_name}
                onChange={handleNewServiceChange} 
                required
              />
            </Form.Group>
            <Form.Group controlId="formServiceDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                type="text" 
                name="description"
                value={newServiceForm.description}
                onChange={handleNewServiceChange} 
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Crear Servicio
            </Button>
          </Form>
        )}
        <Row>
          {services.map((service) => (
            <Col key={service.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>
                    {service.service_name} 
                    {userRole === "super_admin" && (
                      <>
                        <BsFillPencilFill className="ms-2" onClick={() => handleEditServiceClick(service)} />
                        <BsFillTrash3Fill className="ms-2" onClick={() => handleDeleteServiceClick(service.id)} />
                      </>
                    )}
                  </Card.Title>
                  <Card.Text>Descripción: {service.description}</Card.Text>
                  {editingService === service.id && (
                    <Form onSubmit={handleEditServiceSubmit}>
                      <Form.Group controlId="formServiceName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="service_name"
                          value={editServiceForm.service_name}
                          onChange={handleEditServiceChange} 
                        />
                      </Form.Group>
                      <Form.Group controlId="formServiceDescription">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="description"
                          value={editServiceForm.description}
                          onChange={handleEditServiceChange} 
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Guardar
                      </Button>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}