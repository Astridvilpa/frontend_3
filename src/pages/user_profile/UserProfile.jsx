import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/userCall";
import "./UserProfile.css";
import { CustomInput } from "../../components/custom_input/CustomInput";

// Componente de perfil de usuario
export default function UserProfile({ isAdmin }) {
  // Estados para almacenar los datos del perfil, email, estado de edición y token
  const [profileData, setProfileData] = useState(null);
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // useEffect para cargar el perfil del usuario cuando el componente se monta
  useEffect(() => {
    const userToken = JSON.parse(localStorage.getItem("userToken"));
    const token = userToken?.token;
    setToken(token);

    // Si no hay token, redirigir al usuario a la página de login
    if (!token) {
      navigate("/login");
      return;
    }

    // Función para obtener el perfil del usuario
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

    // Llamar a la función para obtener el perfil del usuario si el token está presente y no está en modo de edición
    if (token && !editing) {
      getProfileHandler(token);
    }
  }, [editing, token, navigate]);

  // Manejador de cambios en los inputs de edición
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

  // Función para enviar los cambios del perfil
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

  // Mostrar mensaje de carga si los datos del perfil aún no están disponibles
  if (!profileData) {
    return <div>Loading....</div>;
  }

  return (
    <div className="profile-body">
      {/* Barra de navegación */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Tattoo Studio
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAdmin && (
                <Nav.Link as={Link} to="/admin-dashboard">
                  Admin Dashboard
                </Nav.Link>
              )}
              <NavDropdown title="Account" id="basic-nav-dropdown">
                <NavDropdown.Item href="#modify-profile">
                  Appointments
                </NavDropdown.Item>
                <NavDropdown.Item href="#new-appointment">
                  New Appointments
                </NavDropdown.Item>
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

      {/* Contenido del perfil */}
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