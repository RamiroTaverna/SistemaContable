import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAsientos: 0,
    totalCompras: 0,
    totalVentas: 0,
    totalCuentas: 0
  });
  const [recentAsientos, setRecentAsientos] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Aquí cargarías los datos reales desde el backend
      // Por ahora usamos datos de ejemplo
      setStats({
        totalAsientos: 150,
        totalCompras: 45,
        totalVentas: 67,
        totalCuentas: 89
      });

      setRecentAsientos([
        { id: 1, fecha: '2024-01-15', num_asiento: 1001, descripcion: 'Venta de mercaderías', monto: 50000 },
        { id: 2, fecha: '2024-01-14', num_asiento: 1000, descripcion: 'Compra de insumos', monto: 25000 },
        { id: 3, fecha: '2024-01-13', num_asiento: 999, descripcion: 'Pago de servicios', monto: 15000 }
      ]);

      setChartData([
        { name: 'Activos', value: 400000, color: '#0088FE' },
        { name: 'Pasivos', value: 200000, color: '#00C49F' },
        { name: 'Patrimonio', value: 200000, color: '#FFBB28' }
      ]);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      {/* Tarjetas de estadísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <Card.Title>Total Asientos</Card.Title>
              <h3 className="text-primary">{stats.totalAsientos}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <Card.Title>Compras</Card.Title>
              <h3 className="text-success">{stats.totalCompras}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <Card.Title>Ventas</Card.Title>
              <h3 className="text-info">{stats.totalVentas}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <Card.Title>Cuentas</Card.Title>
              <h3 className="text-warning">{stats.totalCuentas}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Gráfico de distribución patrimonial */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Distribución Patrimonial</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Asientos recientes */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Asientos Recientes</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>N° Asiento</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAsientos.map((asiento) => (
                    <tr key={asiento.id}>
                      <td>{asiento.fecha}</td>
                      <td>
                        <Badge bg="primary">{asiento.num_asiento}</Badge>
                      </td>
                      <td>{asiento.descripcion}</td>
                      <td>${asiento.monto.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 