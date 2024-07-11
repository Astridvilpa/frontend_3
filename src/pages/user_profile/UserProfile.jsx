import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/userCall";
import "./UserProfile.css";
import { CustomInput } from "../../components/custom_input/CustomInput";

// Componente de perfil de usuario
export default function UserProfile({ isAdmin }) {
  const [profileData, setProfileData] = useState(null);
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [token, setToken] = useState("");
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
          console.log("profileData:", data);
          console.log("profile Data Role:", data.role?.name);
        } else {
          console.error("Error al recuperar los datos del perfil:", response.message);
        }
      } catch (error) {
        console.error("Error al obtener los datos del perfil:", error);
      }
    };

    if (token && !editing) {
      getProfileHandler(token);
    }
  }, [editing, token, navigate]);

  const editInputHandler = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    }

    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log(`${name}: ${value}`);
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

  if (!profileData) {
    return <div>Loading....</div>;
  }

  const navLinksUser = (
    <>
      <Nav.Link as={Link} to="/profile">Perfil</Nav.Link>
      <Nav.Link as={Link} to="/appointments">Citas</Nav.Link>
      <Nav.Link as={Link} to="/new-appointment">Nueva Cita</Nav.Link>
      <Nav.Link as={Link} to="/services">Ver Servicios</Nav.Link>
      <Nav.Link as={Link} to="/galeria">Galería</Nav.Link>
      <Nav.Link as={Link} to="/artistas">Artistas</Nav.Link>
    </>
  );

  const navLinksAdmin = (
    <>
      <Nav.Link as={Link} to="/all-users">Ver Todos los Usuarios</Nav.Link>
      <Nav.Link as={Link} to="/appointments">Ver Citas</Nav.Link>
      <Nav.Link as={Link} to="/services">Ver Servicios</Nav.Link>
      <Nav.Link as={Link} to="/artistas">Ver Artistas</Nav.Link>
    </>
  );

  return (
    <div className="profile-body">
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Tattoo Studio
          </Navbar.Brand>
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
        </div>
      </div>
    </div>
  );
}