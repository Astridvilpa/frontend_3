import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, Form, Row, Col, Card, Button, Alert, NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import { getProfile, updateProfile, getAllUsers, updateUserById, deleteUserById } from "../../services/userCall";
import { createArtist, getAllArtists, updateArtistById, deleteArtistById } from "../../services/artistCall";
import "./UserProfile.css";
import { BsFillPencilFill, BsFillTrash3Fill } from "react-icons/bs";

export default function UserProfile({ isAdmin }) {
  const [profileData, setProfileData] = useState(null);
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [showArtists, setShowArtists] = useState(false);
  const [noUsersMessage, setNoUsersMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ first_name: "", last_name: "", email: "" });
  const [editArtistForm, setEditArtistForm] = useState({ name: "", Bio: "", Specialty: "" });
  const [error, setError] = useState(null);
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
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

    const fetchArtists = async () => {
      try {
        const response = await getAllArtists(token);
        if (response.success && Array.isArray(response.data)) {
          setArtists(response.data);
        } else {
          console.error("Expected array of artists, received:", response);
          setError("Error al obtener artistas: respuesta inesperada.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Error al obtener artistas: ${err.message}`);
      }
    };

    if (token) {
      getProfileHandler(token);
      if (isAdmin) {
        fetchUsers();
        fetchArtists();
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

  const handleCreateArtist = async () => {
    try {
      const response = await createArtist(editArtistForm, token);
      if (response.success) {
        setArtists([...artists, response.data]);
        setShowArtistForm(false);
        setEditArtistForm({ name: "", Bio: "", Specialty: "" });
        console.log("Artista creado exitosamente:", response.message);
      } else {
        console.error("Error al crear el artista:", response.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleEditArtistClick = (artist) => {
    if (editingArtist === artist.id) {
      setEditingArtist(null);
    } else {
      setEditingArtist(artist.id);
      setEditArtistForm({ name: artist.name, Bio: artist.Bio, Specialty: artist.Specialty });
    }
  };

  const handleEditArtistChange = (e) => {
    setEditArtistForm({ ...editArtistForm, [e.target.name]: e.target.value });
  };

  const handleEditArtistSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateArtistById({ id: editingArtist, ...editArtistForm }, token);
      if (response.success) {
        const updatedArtists = artists.map(artist =>
          artist.id === editingArtist ? { ...artist, ...editArtistForm } : artist
        );
        setArtists(updatedArtists);
        setEditingArtist(null);
        console.log("Artista actualizado con éxito:", response.message);
      } else {
        console.error("Error al actualizar el artista:", response.message);
      }
    } catch (error) {
      console.error("Error al actualizar el artista:", error);
    }
  };

  const handleDeleteArtistClick = async (artistId) => {
    try {
      const response = await deleteArtistById(artistId, token);
      if (response.success) {
        const updatedArtists = artists.filter(artist => artist.id !== artistId);
        setArtists(updatedArtists);
        console.log("Artista eliminado con éxito:", response.message);
      } else {
        console.error("Error al eliminar el artista:", response.message);
      }
    } catch (error) {
      console.error("Error al eliminar el artista:", error);
    }
  };

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

  const artistListAdmin = (
    <div>
      <Button variant="primary" className="my-4" onClick={() => setShowArtistForm(true)}>
        Crear Artista
      </Button>
      <Row>
        {artists.map((artist) => (
          <Col key={artist.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  {artist.name}
                  <BsFillPencilFill className="ms-2" onClick={() => handleEditArtistClick(artist)} />
                  <BsFillTrash3Fill className="ms-2" onClick={() => handleDeleteArtistClick(artist.id)} />
                </Card.Title>
                <Card.Text>{artist.Bio}</Card.Text>
                <Card.Subtitle className="mb-2 text-muted">{artist.Specialty}</Card.Subtitle>
                {editingArtist === artist.id && (
                  <Form onSubmit={handleEditArtistSubmit}>
                    <Form.Group controlId="formName">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="name"
                        value={editArtistForm.name}
                        onChange={handleEditArtistChange} 
                      />
                    </Form.Group>
                    <Form.Group controlId="formBio">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="Bio"
                        value={editArtistForm.Bio}
                        onChange={handleEditArtistChange} 
                      />
                    </Form.Group>
                    <Form.Group controlId="formSpecialty">
                      <Form.Label>Especialidad</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="Specialty"
                        value={editArtistForm.Specialty}
                        onChange={handleEditArtistChange} 
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

  const artistListUser = (
    <Row>
      {artists.map((artist) => (
        <Col key={artist.id} md={4} className="mb-4">
          <Card>
            <Card.Img variant="top" src={artist.imageUrl} /> {/* Asegúrate de tener imageUrl en los datos de artista */}
            <Card.Body>
              <Card.Title>{artist.name}</Card.Title>
              <Card.Text>{artist.Bio}</Card.Text>
              <Card.Subtitle className="mb-2 text-muted">{artist.Specialty}</Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={() => { setShowUsers(false); setEditing(false); setShowArtists(false); }}>
            Tattoo Studio
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {isAdmin ? (
                <>
                  <Nav.Link onClick={() => { setShowUsers(true); setShowArtists(false); navigate("/admin"); }}>Usuarios</Nav.Link>
                  <Nav.Link onClick={() => { setShowArtists(true); setShowUsers(false); navigate("/admin"); }}>Artistas</Nav.Link>
                  <Nav.Link as={Link} to="/cartelera">Ver Servicios</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/cartelera">Ver Servicios</Nav.Link>
                  <Nav.Link as={Link} to="/galeria">Galería</Nav.Link>
                  <Nav.Link as={Link} to="/artistas">Artistas</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              <NavDropdown title={profileData.first_name} id="collasible-nav-dropdown">
                <NavDropdown.Item onClick={() => { setEditing(true); setShowCreateForm(false); }}>Editar Perfil</NavDropdown.Item>
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
        ) : showUsers ? filteredUserList : showArtists ? (isAdmin ? artistListAdmin : artistListUser) : (
          <Row className="justify-content-center">
            <h1>Bienvenido, {profileData.first_name}!</h1>
          </Row>
        )}

        {/* Formulario para crear un artista */}
        {showArtistForm && (
          <Form className="my-4">
            <Form.Group controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={editArtistForm.name}
                onChange={handleEditArtistChange} 
              />
            </Form.Group>
            <Form.Group controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control 
                type="text" 
                name="Bio"
                value={editArtistForm.Bio}
                onChange={handleEditArtistChange} 
              />
            </Form.Group>
            <Form.Group controlId="formSpecialty">
              <Form.Label>Especialidad</Form.Label>
              <Form.Control 
                type="text" 
                name="Specialty"
                value={editArtistForm.Specialty}
                onChange={handleEditArtistChange} 
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateArtist}>
              Crear Artista
            </Button>
          </Form>
        )}
      </Container>
    </div>
  );
}