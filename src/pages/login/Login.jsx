import React, {useState} from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Login.css";
import { CustomInput } from "../../components/custom_input/CustomInput"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { login } from "../../services/apiCall";


export default function Login() {
    // Estado para almacenar las credenciales del usuario
    const [credentials, setCredentials] = useState({
      email: "",
      password: "",
    });
  
    // Estado para almacenar mensajes de error
    const [errorMsg, setErrorMsg] = useState("");
  
    // Hook para navegar programáticamente
    const navigate = useNavigate();
  
    // Función para manejar cambios en los inputs y actualizar el estado de credentials
    const inputHandler = (e) => {
      setCredentials({
        ...credentials,
        [e.target.name]: e.target.value,
      });
    };
  
    // Función para manejar el proceso de inicio de sesión
    const loginHandler = async () => {
      // Verifica si ambos campos de correo y contraseña están llenos
      if (credentials.email.trim() === "" || credentials.password.trim() === "") {
        setErrorMsg("Todos los campos son requeridos");
        return;
      }
  
      try {
        // Intenta iniciar sesión con las credenciales proporcionadas
        const token = await login(credentials);
        const decoded = jwtDecode(token);
        console.log(token, "mi token");
      console.log(decoded, "soy info");



  
        // Si el inicio de sesión es exitoso
        if (token) {
          const userToken = {
            token: token,
            decoded: decoded,
          };
  
          // Almacena el token y la información decodificada en el almacenamiento local
          localStorage.setItem("userToken", JSON.stringify(userToken));
  
          // Redirige basado en el rol del usuario
          if (decoded.userRoleName === "super_admin") {
            navigate("/admin-dashboard");
          } else if (decoded.userRoleName === "user") {
            navigate("/profile");
          } else {
            setErrorMsg("Rol de usuario desconocido");
          }
        } else {
          console.log("Login sin éxito");
        }
      } catch (error) {
        console.error("Error en login:", error);
        setErrorMsg("Error en el inicio de sesión");
      }
    };
  
    return (
      <div className="login-body">
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
          <Container>
            <Navbar.Brand href="/">Tattoo Studio</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="/home">Home</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="login-container">
          <h1>Login</h1>
          <CustomInput
            type="email"
            name="email"
            placeholder="Introduce email"
            value={credentials.email}
            handler={inputHandler}
          />
          <CustomInput
            type="password"
            name="password"
            placeholder="Introduce password"
            value={credentials.password}
            handler={inputHandler}
          />
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          <button className="login-btn" onClick={loginHandler}>
            Login
          </button>
        </div>
      </div>
    );
  }