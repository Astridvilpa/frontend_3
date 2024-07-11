import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Home.css";

export default function Home() {
  return (
    <div className="body-home">
      <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="/">Tattoo Studio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/Estudio">Estudio</Nav.Link>
              <Nav.Link as={Link} to="/Artistas">Artistas</Nav.Link>
              <Nav.Link as={Link} to="/Galeria">Galeria</Nav.Link>
              <Nav.Link as={Link} to="/Register">Register</Nav.Link>
              <Nav.Link as={Link} to="/Login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="welcome-container">
        <Container>
          <h1 className="text-center">Bienvenidos</h1>
          <p className="init">¿Tienes una Idea pero necesitas a un Artista del Tatuaje que te Ayude? ven a nuestro Estudio de Tatuajes en Madrid y diseñaremos algo Original para ti!</p>
          <p className="init">Somos un equipo que se especializa en tatuajes personalizados y de calidad en diferentes estilos, como lettering tattoos, tatuaje estilo acuarela, tatuajes geométricos en puntillismo, tatuajes en realismo y microrealismo, Fine Line Tattoo o Líneas Finas, tatuaje neotradicional, minimalistas o estilo Blackwork. Ya sea un diseño pequeño, mediano o grande, deja que nosotros como artistas tatuadores profesionales con años de experiencia le demos vida a tu idea con un tatuaje único.</p>
        </Container>
      </div>
    </div>
  );
}