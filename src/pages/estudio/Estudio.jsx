import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import "./Estudio.css"; 

const Estudio = () => {
  React.useEffect(() => {
    document.body.classList.add('estudio-body');
    
    return () => {
      document.body.classList.remove('estudio-body');
    };
  }, []);

  return (
    <div className="studio-view">
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">Tattoo Studio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/galeria">Galeria</Nav.Link>
              <Nav.Link as={Link} to="/artistas">Artistas</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="studio-content">
        <div className="studio-text">
          <h1>Tattoo Studio</h1>
          <p>Bienvenidos a Nuestro Estudio de Tatuajes en Madrid. Cada mañana nos levantamos con un objetivo claro: crear los mejores tatuajes del planeta. Es ambicioso, sí, pero es lo que nos impulsa. Estamos agradecidos con todas las personas que han permitido que seamos parte de sus historias, historias que se cuentan en el lienzo más excepcional: el cuerpo humano.</p>
          <p>Ubicado en el vibrante Centro de Madrid, en el Barrio Imperial del distrito de Arganzuela, nuestro estudio se encuentra a pasos del Metro Puerta de Toledo y Pirámides. Aquí, somos más que un estudio de tatuajes; somos un espacio artístico, personalizado, moderno y diferente.</p>
          <p>Lo que nos define:</p>
          <ul>
            <li>Artistas Profesionales y Apasionados: Nuestro equipo está compuesto por tatuadores profesionales, apasionados y con una vasta experiencia. Trabajamos estrechamente contigo para guiar y producir tatuajes de calidad, asegurando que tu experiencia sea memorable.</li>
            <li>Diversidad de Estilos: Además de nuestro talento local, recibimos mensualmente a artistas invitados especializados en realismo, microrealismo, watercolor tattoo, new school tattoos, tatuajes geométricos y más. Así, aseguramos que encuentres el estilo perfecto para ti.</li>
            <li>Comodidad y Entretenimiento: Nuestra amplia sala de espera está equipada con tecnología de vanguardia, incluyendo un Smart TV para que disfrutes de películas o música mientras esperas tu turno.</li>
            <li>Compromiso con la Higiene: Nos tomamos muy en serio tu salud y seguridad. Cumplimos con las normas de higiene más estrictas y necesarias para garantizar un proceso de tatuaje seguro y libre de preocupaciones.</li>
          </ul>
          <p>En nuestro estudio, cada tatuaje es una obra de arte personalizada. Nos dedicamos a transformar tus ideas en realidad, con un enfoque creativo y atención al detalle que marca la diferencia.</p>
          <p>Únete a nosotros y haz de tu piel un lienzo único. Bienvenido a nuestro estudio, donde cada tatuaje cuenta una historia especial.</p>
        </div>
        <div className="studio-image">
          <img src="./img/estudy.jpg" alt="study" />
        </div>
      </div>
    </div>
  );
};

export default Estudio;