import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { getAllAppointments, createAppointment, updateAppointmentById, deleteAppointmentById } from "../../services/appointment";
import { getAllServices } from "../../services/serviceCall";
import { getAllArtists } from "../../services/artistCall";
import { useAuth } from "../../contexts/auth-context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import "./Appointments.css";

export default function Appointments({ isAdmin }) {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [artists, setArtists] = useState([]);
  const [appointmentForm, setAppointmentForm] = useState({ appointment_date: "", service_id: "", artist_id: "" });
  const [error, setError] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const navigate = useNavigate();
  const { userToken } = useAuth(); 

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
      return;
    }

    const token = userToken.token;

    const fetchAppointments = async () => {
      try {
        const response = await getAllAppointments(token);
        if (response.success) {
          setAppointments(response.data);
        } else {
          setError("Error al obtener citas.");
        }
      } catch (err) {
        setError("Error al obtener citas.");
      }
    };

    const fetchServices = async () => {
      try {
        const response = await getAllServices(token);
        if (response.success) {
          setServices(response.data);
        } else {
          setError("Error al obtener servicios.");
        }
      } catch (err) {
        setError("Error al obtener servicios.");
      }
    };

    const fetchArtists = async () => {
      try {
        const response = await getAllArtists(token);
        if (response.success) {
          setArtists(response.data);
        } else {
          setError("Error al obtener artistas.");
        }
      } catch (err) {
        setError("Error al obtener artistas.");
      }
    };

    fetchAppointments();
    fetchServices();
    fetchArtists();
  }, [userToken, navigate]);

  const handleCreateAppointment = async () => {
    try {
      const response = await createAppointment(appointmentForm, userToken.token);
      if (response.success) {
        setAppointments([...appointments, response.data]);
        setAppointmentForm({ appointment_date: "", service_id: "", artist_id: "" });
      } else {
        setError("Error al crear la cita.");
      }
    } catch (error) {
      setError("Error al crear la cita.");
    }
  };

  const handleEditAppointmentChange = (e) => {
    setAppointmentForm({ ...appointmentForm, [e.target.name]: e.target.value || "" });
  };

  const handleEditAppointmentClick = (appointment) => {
    setEditingAppointment(appointment.id);
    setAppointmentForm({
      appointment_date: appointment.appointment_date,
      service_id: appointment.service_id || "",
      artist_id: appointment.artist_id || ""
    });
  };

  const handleEditAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateAppointmentById({ id: editingAppointment, ...appointmentForm }, userToken.token);
      if (response.success) {
        const updatedAppointments = appointments.map(appointment =>
          appointment.id === editingAppointment ? { ...appointment, ...appointmentForm } : appointment
        );
        setAppointments(updatedAppointments);
        setEditingAppointment(null);
      } else {
        setError("Error al actualizar la cita.");
      }
    } catch (error) {
      setError("Error al actualizar la cita.");
    }
  };

  const handleDeleteAppointmentClick = async (appointmentId) => {
    try {
      const response = await deleteAppointmentById(appointmentId, userToken.token);
      if (response.success) {
        setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
      } else {
        setError("Error al eliminar la cita.");
      }
    } catch (error) {
      setError("Error al eliminar la cita.");
    }
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" className="my-4" onClick={() => setEditingAppointment(null)}>
        Crear Cita
      </Button>
      <Row>
        {appointments.map((appointment) => (
          <Col key={appointment.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  {new Date(appointment.appointment_date).toLocaleString()}
                  <Button className="ms-2" onClick={() => handleEditAppointmentClick(appointment)}>Editar</Button>
                  <Button className="ms-2" onClick={() => handleDeleteAppointmentClick(appointment.id)}>Eliminar</Button>
                </Card.Title>
                <Card.Text>ID Usuario: {appointment.user.id}</Card.Text>
                <Card.Text>Usuario: {appointment.user.first_name} {appointment.user.last_name}</Card.Text>
                <Card.Text>
                  Servicio: {services.find(service => service.id === appointment.service_id)?.service_name || "No asignado"}
                </Card.Text>
                <Card.Text>
                  Artista: {artists.find(artist => artist.id === appointment.artist_id)?.name || "No asignado"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Form className="my-4" onSubmit={handleEditAppointmentSubmit}>
        <Form.Group controlId="formAppointmentDate">
          <Form.Label>Fecha y Hora</Form.Label>
          <Form.Control 
            type="datetime-local" 
            name="appointment_date"
            value={appointmentForm.appointment_date}
            onChange={handleEditAppointmentChange} 
          />
        </Form.Group>
        <Form.Group controlId="formServiceId">
          <Form.Label>Servicio</Form.Label>
          <Form.Control 
            as="select" 
            name="service_id"
            value={appointmentForm.service_id}
            onChange={handleEditAppointmentChange}
          >
            <option value="">Seleccionar Servicio</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.service_name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formArtistId">
          <Form.Label>Artista</Form.Label>
          <Form.Control 
            as="select" 
            name="artist_id"
            value={appointmentForm.artist_id}
            onChange={handleEditAppointmentChange}
          >
            <option value="">Seleccionar Artista</option>
            {artists.map(artist => (
              <option key={artist.id} value={artist.id}>{artist.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          {editingAppointment ? "Actualizar Cita" : "Crear Cita"}
        </Button>
      </Form>
    </Container>
  );
}