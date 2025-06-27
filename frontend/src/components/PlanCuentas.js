import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const PlanCuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState(null);
  const [formData, setFormData] = useState({
    cod_rubro: '',
    rubro: '',
    cod_subrubro: '',
    subrubro: '',
    cod_cuenta: '',
    cuenta: '',
    empresa_id: 1
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCuentas();
  }, []);

  const loadCuentas = async () => {
    try {
      const response = await axios.get('/api/plan-cuentas/1');
      setCuentas(response.data);
    } catch (error) {
      setError('Error al cargar el plan de cuentas');
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCuenta) {
        await axios.put(`/api/plan-cuentas/${editingCuenta.id}`, formData);
        setSuccess('Cuenta actualizada exitosamente');
      } else {
        await axios.post('/api/plan-cuentas', formData);
        setSuccess('Cuenta creada exitosamente');
      }
      
      setShowModal(false);
      resetForm();
      loadCuentas();
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar la cuenta');
    }
  };

  const handleEdit = (cuenta) => {
    setEditingCuenta(cuenta);
    setFormData({
      cod_rubro: cuenta.cod_rubro,
      rubro: cuenta.rubro,
      cod_subrubro: cuenta.cod_subrubro,
      subrubro: cuenta.subrubro,
      cod_cuenta: cuenta.cod_cuenta,
      cuenta: cuenta.cuenta,
      empresa_id: 1
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cuenta?')) {
      try {
        await axios.delete(`/api/plan-cuentas/${id}`);
        setSuccess('Cuenta eliminada exitosamente');
        loadCuentas();
      } catch (error) {
        setError('Error al eliminar la cuenta');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      cod_rubro: '',
      rubro: '',
      cod_subrubro: '',
      subrubro: '',
      cod_cuenta: '',
      cuenta: '',
      empresa_id: 1
    });
    setEditingCuenta(null);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Agrupar cuentas por rubro y subrubro
  const groupedCuentas = cuentas.reduce((acc, cuenta) => {
    if (!acc[cuenta.cod_rubro]) {
      acc[cuenta.cod_rubro] = {
        rubro: cuenta.rubro,
        subrubros: {}
      };
    }
    
    if (!acc[cuenta.cod_rubro].subrubros[cuenta.cod_subrubro]) {
      acc[cuenta.cod_rubro].subrubros[cuenta.cod_subrubro] = {
        subrubro: cuenta.subrubro,
        cuentas: []
      };
    }
    
    acc[cuenta.cod_rubro].subrubros[cuenta.cod_subrubro].cuentas.push(cuenta);
    return acc;
  }, {});

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Plan de Cuentas</h2>
        <Button variant="primary" onClick={openModal}>
          Nueva Cuenta
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Vista jerárquica del plan de cuentas */}
      {Object.entries(groupedCuentas).map(([codRubro, rubroData]) => (
        <Card key={codRubro} className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              {codRubro} - {rubroData.rubro}
            </h5>
          </Card.Header>
          <Card.Body>
            {Object.entries(rubroData.subrubros).map(([codSubrubro, subrubroData]) => (
              <div key={codSubrubro} className="mb-3">
                <h6 className="text-secondary">
                  {codSubrubro} - {subrubroData.subrubro}
                </h6>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Cuenta</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subrubroData.cuentas.map((cuenta) => (
                      <tr key={cuenta.id}>
                        <td>
                          <strong>{cuenta.cod_cuenta}</strong>
                        </td>
                        <td>{cuenta.cuenta}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(cuenta)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(cuenta.id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))}
          </Card.Body>
        </Card>
      ))}

      {/* Modal para crear/editar cuenta */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCuenta ? 'Editar Cuenta' : 'Nueva Cuenta'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código Rubro</Form.Label>
                  <Form.Control
                    type="text"
                    name="cod_rubro"
                    value={formData.cod_rubro}
                    onChange={handleFormChange}
                    required
                    placeholder="Ej: 1"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rubro</Form.Label>
                  <Form.Control
                    type="text"
                    name="rubro"
                    value={formData.rubro}
                    onChange={handleFormChange}
                    required
                    placeholder="Ej: ACTIVO"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código Subrubro</Form.Label>
                  <Form.Control
                    type="text"
                    name="cod_subrubro"
                    value={formData.cod_subrubro}
                    onChange={handleFormChange}
                    required
                    placeholder="Ej: 11"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subrubro</Form.Label>
                  <Form.Control
                    type="text"
                    name="subrubro"
                    value={formData.subrubro}
                    onChange={handleFormChange}
                    required
                    placeholder="Ej: ACTIVO CORRIENTE"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código Cuenta</Form.Label>
                  <Form.Control
                    type="text"
                    name="cod_cuenta"
                    value={formData.cod_cuenta}
                    onChange={handleFormChange}
                    required
                    placeholder="Ej: 1101"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cuenta</Form.Label>
                  <Form.Control
                    type="text"
                    name="cuenta"
                    value={formData.cuenta}
                    onChange={handleFormChange}
                    required
                    placeholder="Ej: Caja"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingCuenta ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PlanCuentas; 