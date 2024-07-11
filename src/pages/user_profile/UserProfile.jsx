import { Navbar, Container, Nav, NavDropdown, Form, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile, updateProfile, getAllUsers, updateUserById, deleteUserById } from "../../services/userCall";
import "./UserProfile.css";
import { CustomInput } from "../../components/custom_input/CustomInput";
import { BsFillPencilFill, BsFillTrash3Fill } from "react-icons/bs";

// Componente de perfil de usuario
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

  if (!profileData) {
    return <div>Loading....</div>;
  }

  const navLinksUser = (
    <>
      <Nav.Link as={Link} to="/profile" onClick={() => setShowUsers(false)}>Perfil</Nav.Link>
      <Nav.Link as={Link} to="/appointments">Citas</Nav.Link>
      <Nav.Link as={Link} to="/new-appointment">Nueva Cita</Nav.Link>
      <Nav.Link as={Link} to="/cartelera">Ver Servicios</Nav.Link>
      <Nav.Link as={Link} to="/galeria">Galería</Nav.Link>
      <Nav.Link as={Link} to="/artistas">Artistas</Nav.Link>
    </>
  );

  const navLinksAdmin = (
    <>
      <Nav.Link as={Link} to="/profile" onClick={() => setShowUsers(false)}>Perfil</Nav.Link>
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
                {/* <Card.Text>Rol: {user.role?.name || "No asignado"}</Card.Text> */}
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
                      Guardar
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
    <div className="profile-body">
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">Tattoo Studio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {profileData.role?.name === "super_admin" ? navLinksAdmin : navLinksUser}
              <NavDropdown title="Account" id="basic-nav-dropdown">
                <NavDropdown.Item
                  onClick={() => {
                    localStorage.removeItem("userToken");
                    window.location.href = "/";
                  }}
                >
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="profile-container">
        <div className="profile-content">
          {!showUsers && (
            <>
              <p>Bienvenido</p>
              <p>{profileData.role?.name || "Sin rol"}</p>
              <CustomInput
                type="text"
                name="first_name"
                value={profileData.first_name || ""}
                handler={editInputHandler}
                isDisabled={!editing}
              />
              <CustomInput
                type="text"
                name="last_name"
                value={profileData.last_name || ""}
                handler={editInputHandler}
                isDisabled={!editing}
              />
              <CustomInput
                type="email"
                name="email"
                value={email}
                handler={editInputHandler}
                isDisabled={!editing}
              />
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)}>Descartar</button>
                  <button onClick={submitChanges}>Guardar</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)}>Editar</button>
              )}
            </>
          )}
          {profileData.role?.name === "super_admin" && showUsers && filteredUserList}
        </div>
      </div>
    </div>
  );
}