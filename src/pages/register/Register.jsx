import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Register.css";
import { useState } from "react";
import { CustomInput } from "../../components/custom_input/CustomInput";
import { register } from "../../services/apiCall";
import { useAuth } from "../../contexts/auth-context/AuthContext";
import { jwtDecode } from "jwt-decode";


export default function Register() {
  const [first_name, setFirst_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [registrationErrorMsg, setRegistrationErrorMsg] = useState("");

  const navigate = useNavigate();
  const { logan } = useAuth(); 

  const inputHandler = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
    if (name === "first_name") {
      setFirst_name(value);
    }
  };

  const inputCheker = () => {
    let message = "";

    if (email.trim() === "") {
      message += "Email is required. ";
    }
    if (password.trim() === "") {
      message += "Password is required. ";
    }
    if (first_name.trim() === "") {
      message += "First name is required. ";
    }

    if (message === "") {
      setMsg("Registration successful");
    } else {
      setRegistrationErrorMsg(message);
    }
  };

  const registerHandler = async () => {
    if (email.trim() === "" || password.trim() === "" || first_name.trim() === "") {
      setRegistrationErrorMsg("Todos los campos son requeridos");
      return;
    }

    const newUser = {
      first_name: first_name,
      email: email,
      password: password,
    };

    try {
      const res = await register(newUser);
      if (res && res.token) {
        const userToken = {
          token: res.token,
          decoded: decode(res.token),
        };

        logan(userToken); 

        setMsg("Registro exitoso");
        setTimeout(() => {
          navigate("/profile"); 
        }, 1500);
      } else {
        setRegistrationErrorMsg("Error al registrarse");
      }
    } catch (error) {
      setRegistrationErrorMsg("Error al registrarse");
    }
  };

  return (
    <div className="body-register">
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/">Tattoo Studio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="register-container">
        <h2>Registrate</h2>
        <form onSubmit={registerHandler}>
          <CustomInput
            type="text"
            name="first_name"
            placeholder="Introduce first name"
            value={first_name}
            handler={inputHandler}
          />
          <CustomInput
            type="email"
            name="email"
            placeholder="Introduce email"
            value={email}
            handler={inputHandler}
          />
          <CustomInput
            type="password"
            name="password"
            placeholder="Introduce password"
            value={password}
            handler={inputHandler}
          />
          <button className="register-btn" type="submit">
            Enviar
          </button>
        </form>
        <p className="error-message">{registrationErrorMsg}</p>
        <p>{msg}</p>
      </div>
    </div>
  );
}