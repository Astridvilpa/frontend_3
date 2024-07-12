import React from 'react';
import { Navbar, Container, Nav, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Artista.css';

const Artistas = () => {
 
  const artistas = [
    {
      nombre: 'Katherine von Drachenberg',
      imagen: './img/kathe.jpg',
      resena: 'Especialista en tatuajes realistas con más de 10 años de experiencia.',
    },
    {
      nombre: 'Ami James',
      imagen: './img/ami.jpg',
      resena: 'Apasionado por el tatuaje en acuarela y colores vivos.',
    },
    {
      nombre: 'Nikko Hurtado',
      imagen: './img/niko.jpg',
      resena: 'Experto en tatuajes geométricos y minimalistas.',
    },
    {
        nombre: 'Yoshihito Nakano',
        imagen: './img/yoshi.jpg',
        resena: 'Experto en tatuajes blanco y negro.',
      },
      {
        nombre: 'Brian Woo',
        imagen: './img/brian.jpg',
        resena: 'Experto enla colocación de piercings y dilatadores.',
      },
   
  ];

  return (
    <div className="artistas-body">
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">Tattoo Studio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
              <Nav.Link as={Link} to="/galeria">Galeria</Nav.Link>
              <Nav.Link as={Link} to="/artistas">Artistas</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="artistas-content">
        <h1>Nuestros Artistas</h1>
        <Container>
          <Row>
            {artistas.map((artista, index) => (
              <Col md={4} sm={6} xs={12} key={index}>
                <Card className="artista-card">
                  <Card.Img variant="top" src={artista.imagen} />
                  <Card.Body>
                    <Card.Title>{artista.nombre}</Card.Title>
                    <Card.Text>{artista.resena}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Artistas;