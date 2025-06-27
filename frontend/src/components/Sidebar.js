import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed, onToggle, user }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/plan-cuentas', label: 'Plan de Cuentas', icon: '📋' },
    { path: '/libro-diario', label: 'Libro Diario', icon: '📖' },
    { path: '/asientos-contables', label: 'Asientos Contables', icon: '✏️' },
    { path: '/sub-diario-compras', label: 'Sub Diario Compras', icon: '🛒' },
    { path: '/sub-diario-ventas', label: 'Sub Diario Ventas', icon: '💰' },
    { path: '/reportes', label: 'Reportes', icon: '📈' }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="p-3">
        <div className="d-flex align-items-center mb-3">
          <h5 className="mb-0 text-white">
            {!collapsed && 'Sistema Contable'}
          </h5>
        </div>
        
        {user && !collapsed && (
          <div className="mb-3 p-2 bg-light rounded">
            <small className="text-muted d-block">Usuario</small>
            <strong>{user.nombre} {user.apellido}</strong>
          </div>
        )}
      </div>

      <Nav className="flex-column px-3">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`mb-1 ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="me-2">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Nav.Link>
        ))}
      </Nav>

      <div className="mt-auto p-3">
        <Button
          variant="outline-light"
          size="sm"
          onClick={onToggle}
          className="w-100"
        >
          {collapsed ? '→' : '←'}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar; 