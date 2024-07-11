import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, Form, Row, Col, Card, Button, Alert, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, updateProfile, getAllUsers, updateUserById, deleteUserById } from "../../services/userCall";
import { createAppointment } from "../../services/appointment";
import "./UserProfile.css";
import { BsFillPencilFill, BsFillTrash3Fill } from "react-icons/bs";

export default function UserProfile({ isAdmin }) {
  const [profileData, setProfileData] = useState(null);
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [noUsersMessage, setNoUsersMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ first_name: "", last_name: "", email: "" });
  const [error, setError] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState(""); // Nuevo estado para la hora
  const [serviceId, setServiceId] = useState("");
  const [artistId, setArtistId] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false); // Estado para mostrar/ocultar el formulario de creación de cita
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = JSON.parse(localStorage.getItem("userToken"));
    const token = userToken?.token;
    setToken(token);

    if (!token) {
      navigate("/login");
      return;
    }

    const getProfileHandler = async (token) => {
      try {
        const response = await getProfile(token);
        if (response.success) {
          const data = response.data;
          setProfileData(data);
          setEmail(data.email);
        } else {
          console.error("Error al recuperar los datos del perfil:", response.message);
        }
      } catch (error) {
        console.error("Error al obtener los datos del perfil:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(token);
        if (response.success && Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          console.error("Expected array of users, received:", response);
          setError("Error al obtener usuarios: respuesta inesperada.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Error al obtener usuarios: ${err.message}`);
      }
    };

    if (token) {
      getProfileHandler(token);
      if (isAdmin) {
        fetchUsers();
      }
    }
  }, [editing, token, navigate, isAdmin]);

  const editInputHandler = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    }

    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitChanges = async () => {
    try {
      const response = await updateProfile(profileData, token);
      if (response.success) {
        setEditing(false);
      } else {
        console.log("Error al guardar los datos:", response.error);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const handleEditUserClick = (user) => {
    if (editingUser === user.id) {
      setEditingUser(null);
    } else {
      setEditingUser(user.id);
      setEditForm({ first_name: user.first_name, last_name: user.last_name, email: user.email });
    }
  };

  const handleEditUserChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserById({ id: editingUser, ...editForm }, token);
      if (response.success) {
        const updatedUsers = users.map(user =>
          user.id === editingUser ? { ...user, ...editForm } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setEditingUser(null);
        console.log("Usuario actualizado con éxito:", response.message);
      } else {
        console.error("Error al actualizar el usuario:", response.message);
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const handleDeleteUserClick = async (userId) => {
    try {
      const response = await deleteUserById(userId, token);
      if (response.success) {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        console.log("Usuario eliminado con éxito:", response.message);
      } else {
        console.error("Error al eliminar el usuario:", response.message);
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleCreateAppointment = async () => {
    try {
      const formData = {
        appointment_date: appointmentDate + " " + appointmentTime, // Concatenar fecha y hora
        user_id: profileData.id,
        service_id: serviceId,
        artist_id: artistId,
      };

      const response = await createAppointment(formData, token);
      if (response.success) {
        console.log("Cita creada exitosamente:", response.message);
        // Aquí podrías redirigir o mostrar un mensaje de éxito
      } else {
        console.error("Error al crear la cita:", response.message);
        // Manejar el error o mostrar un mensaje al usuario
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  if (!profileData) {
    return <div>Loading....</div>;
  }

  const navLinksUser = (
    <>
      <Nav.Link as={Link} to="/profile" onClick={() => { setEditing(true); setShowCreateForm(false); }}>Editar Perfil</Nav.Link>
      <Nav.Link as={Link} to="/appointments">Citas</Nav.Link>
      <Nav.Link as={Link} to="/cartelera">Ver Servicios</Nav.Link>
      <Nav.Link as={Link} to="/galeria">Galería</Nav.Link>
      <Nav.Link as={Link} to="/artistas">Artistas</Nav.Link>
    </>
  );

  const navLinksAdmin = (
    <>
      <Nav.Link as={Link} to="/profile" onClick={() => { setEditing(true); setShowCreateForm(false); }}>Editar Perfil</Nav.Link>
      <Nav.Link onClick={() => { setShowUsers(true); navigate("/admin"); }}>Ver Todos los Usuarios</Nav.Link>
      <Nav.Link as={Link} to="/appointments">Ver Citas</Nav.Link>
      <Nav.Link as={Link} to="/cartelera">Ver Servicios</Nav.Link>
      <Nav.Link as={Link} to="/artistas">Ver Artistas</Nav.Link>
    </>
  );

  const filteredUserList = (
    <div>
      <Form className="my-4">
        <Form.Group controlId="filter">
          <Form.Control
            type="text"
            placeholder="Filtrar por email"
            onChange={(e) => setFilter(e.target.value)}
          />
        </Form.Group>
      </Form>
      {noUsersMessage && <Alert variant="info">{noUsersMessage}</Alert>}
      <Row>
        {filteredUsers.filter((user) =>
          user.email.toLowerCase().includes(filter.toLowerCase())
        ).map((user) => (
          <Col key={user.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  {user.first_name} {user.last_name}
                  <BsFillPencilFill className="ms-2" onClick={() => handleEditUserClick(user)} />
                  <BsFillTrash3Fill className="ms-2" onClick={() => handleDeleteUserClick(user.id)} />
                </Card.Title>
                <Card.Text>ID: {user.id}</Card.Text>
                <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
                {editingUser === user.id && (
                  <Form onSubmit={handleEditUserSubmit}>
                    <Form.Group controlId="formFirstName">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="first_name"
                        value={editForm.first_name}
                        onChange={handleEditUserChange} 
                      />
                    </Form.Group>
                    <Form.Group controlId="formLastName">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="last_name"
                        value={editForm.last_name}
                        onChange={handleEditUserChange} 
                      />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email"
                        value={editForm.email}
                        onChange={handleEditUserChange} 
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Guardar Cambios
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={() => { setShowUsers(false); setEditing(false); }}>
            Título del Sitio
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {isAdmin ? navLinksAdmin : navLinksUser}
            </Nav>
            <Nav>
              <NavDropdown title={profileData.first_name} id="collasible-nav-dropdown">
                <NavDropdown.Item onClick={() => { setEditing(true); setShowCreateForm(false); }}>Editar Perfil</NavDropdown.Item>
                <NavDropdown.Item onClick={() => { setShowCreateForm(true); setEditing(false); }}>Crear Cita</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => { localStorage.removeItem("userToken"); navigate("/login"); }}>Cerrar Sesion</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {editing ? (
          <Form onSubmit={(e) => { e.preventDefault(); submitChanges(); }}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control 
                  type="text" 
                  name="first_name" 
                  value={profileData.first_name} 
                  onChange={editInputHandler} 
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formLastName">
                <Form.Label>Apellido</Form.Label>
                <Form.Control 
                  type="text" 
                  name="last_name" 
                  value={profileData.last_name} 
                  onChange={editInputHandler} 
                />
              </Form.Group>
            </Row>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={email} 
                onChange={editInputHandler} 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        ) : showUsers ? filteredUserList : (
          <Row className="justify-content-center">
            <h1>Bienvenido, {profileData.first_name}!</h1>
          </Row>
        )}

        {/* Formulario para crear una cita */}
        {showCreateForm && (
          <Form className="my-4">
            <Form.Group controlId="appointmentDate">
              <Form.Label>Fecha de la cita</Form.Label>
              <Form.Control 
                type="date" 
                value={appointmentDate} 
                onChange={(e) => setAppointmentDate(e.target.value)} 
              />
            </Form.Group>
            <Form.Group controlId="appointmentTime">
              <Form.Label>Hora de la cita</Form.Label>
              <Form.Control 
                type="time" 
                value={appointmentTime} 
                onChange={(e) => setAppointmentTime(e.target.value)} 
              />
            </Form.Group>
            {/* Más campos del formulario de cita, como serviceId, artistId, etc. */}
            <Button variant="primary" onClick={handleCreateAppointment}>
              Crear Cita
            </Button>
          </Form>
        )}
      </Container>
    </div>
  );
}