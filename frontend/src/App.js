import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PlanCuentas from './components/PlanCuentas';
import LibroDiario from './components/LibroDiario';
import AsientosContables from './components/AsientosContables';
import SubDiarioCompras from './components/SubDiarioCompras';
import SubDiarioVentas from './components/SubDiarioVentas';
import Reportes from './components/Reportes';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return (
      <Container fluid>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col md={sidebarCollapsed ? 1 : 3} className="p-0">
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            user={user}
          />
        </Col>
        <Col md={sidebarCollapsed ? 11 : 9} className="p-0">
          <Navbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/plan-cuentas" element={<PlanCuentas />} />
              <Route path="/libro-diario" element={<LibroDiario />} />
              <Route path="/asientos-contables" element={<AsientosContables />} />
              <Route path="/sub-diario-compras" element={<SubDiarioCompras />} />
              <Route path="/sub-diario-ventas" element={<SubDiarioVentas />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App; 