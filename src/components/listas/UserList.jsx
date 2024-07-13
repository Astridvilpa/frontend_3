import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { BsFillPencilFill, BsFillTrash3Fill } from "react-icons/bs";

function UserList({
  users,
  handleEditUserClick,
  handleDeleteUserClick,
  editingUser,
  editForm,
  handleEditUserChange,
  handleEditUserSubmit,
  filter,
  setFilter
}) {
  return (
    <div>
      <Form className="my-4">
        <Form.Group controlId="filter">
          <Form.Control
            type="text"
            placeholder="Filtrar por email"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Row>
        {users.filter((user) =>
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
}

export default UserList;