import React from 'react';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const NavbarComponent = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="white" expand="lg" className="border-bottom">
      <div className="container-fluid">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onToggleSidebar}
          className="me-3"
        >
          ☰
        </Button>
        
        <Navbar.Brand href="/" className="me-auto">
          Sistema Contable
        </Navbar.Brand>

        <Nav className="ms-auto">
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-user">
              {user?.nombre} {user?.apellido}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>
                <small className="text-muted">Usuario</small><br />
                <strong>{user?.username}</strong>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                Cerrar Sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </div>
    </Navbar>
  );
};

export default NavbarComponent; 