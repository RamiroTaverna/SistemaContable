import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Card, Row, Col, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

const AsientosContables = () => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    num_asiento: '',
    doc_respaldatorio: '',
    datos_adjuntos: '',
    leyenda: '',
    empresa_id: 1
  });
  
  const [detalles, setDetalles] = useState([
    { cuenta_id: '', debe: 0, haber: 0 }
  ]);
  
  const [cuentas, setCuentas] = useState([]);
  const [asientos, setAsientos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCuentas();
    loadAsientos();
  }, []);

  const loadCuentas = async () => {
    try {
      const response = await axios.get('/api/plan-cuentas/1');
      setCuentas(response.data);
    } catch (error) {
      console.error('Error cargando cuentas:', error);
    }
  };

  const loadAsientos = async () => {
    try {
      const response = await axios.get('/api/asientos/1');
      setAsientos(response.data);
    } catch (error) {
      console.error('Error cargando asientos:', error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDetalleChange = (index, field, value) => {
    const newDetalles = [...detalles];
    newDetalles[index][field] = value;
    setDetalles(newDetalles);
  };

  const addDetalle = () => {
    setDetalles([...detalles, { cuenta_id: '', debe: 0, haber: 0 }]);
  };

  const removeDetalle = (index) => {
    if (detalles.length > 1) {
      const newDetalles = detalles.filter((_, i) => i !== index);
      setDetalles(newDetalles);
    }
  };

  const validateAsiento = () => {
    const totalDebe = detalles.reduce((sum, det) => sum + parseFloat(det.debe || 0), 0);
    const totalHaber = detalles.reduce((sum, det) => sum + parseFloat(det.haber || 0), 0);
    
    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      setError('El asiento debe estar balanceado (Debe = Haber)');
      return false;
    }
    
    if (detalles.some(det => !det.cuenta_id)) {
      setError('Todas las líneas deben tener una cuenta seleccionada');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateAsiento()) {
      return;
    }

    try {
      const asientoData = {
        ...formData,
        detalles: detalles.map(det => ({
          ...det,
          debe: parseFloat(det.debe),
          haber: parseFloat(det.haber)
        }))
      };

      await axios.post('/api/asientos', asientoData);
      setSuccess('Asiento creado exitosamente');
      setShowModal(false);
      resetForm();
      loadAsientos();
    } catch (error) {
      setError(error.response?.data?.error || 'Error al crear el asiento');
    }
  };

  const resetForm = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      num_asiento: '',
      doc_respaldatorio: '',
      datos_adjuntos: '',
      leyenda: '',
      empresa_id: 1
    });
    setDetalles([{ cuenta_id: '', debe: 0, haber: 0 }]);
  };

  const getCuentaName = (cuentaId) => {
    const cuenta = cuentas.find(c => c.id === cuentaId);
    return cuenta ? cuenta.cuenta : '';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Asientos Contables</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nuevo Asiento
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Tabla de asientos */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Listado de Asientos</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>N° Asiento</th>
                <th>Documento</th>
                <th>Leyenda</th>
                <th>Usuario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {asientos.map((asiento) => (
                <tr key={asiento.id}>
                  <td>{asiento.fecha}</td>
                  <td>{asiento.num_asiento}</td>
                  <td>{asiento.doc_respaldatorio}</td>
                  <td>{asiento.leyenda}</td>
                  <td>{asiento.usuario}</td>
                  <td>
                    ${asiento.detalles.reduce((sum, det) => sum + det.debe, 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para nuevo asiento */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Asiento Contable</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>N° Asiento</Form.Label>
                  <Form.Control
                    type="number"
                    name="num_asiento"
                    value={formData.num_asiento}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Documento Respaldatorio</Form.Label>
                  <Form.Control
                    type="text"
                    name="doc_respaldatorio"
                    value={formData.doc_respaldatorio}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Leyenda</Form.Label>
                  <Form.Control
                    type="text"
                    name="leyenda"
                    value={formData.leyenda}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Datos Adjuntos</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="datos_adjuntos"
                value={formData.datos_adjuntos}
                onChange={handleFormChange}
              />
            </Form.Group>

            <h6>Detalles del Asiento</h6>
            {detalles.map((detalle, index) => (
              <Row key={index} className="mb-2">
                <Col md={6}>
                  <Form.Select
                    value={detalle.cuenta_id}
                    onChange={(e) => handleDetalleChange(index, 'cuenta_id', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar cuenta</option>
                    {cuentas.map((cuenta) => (
                      <option key={cuenta.id} value={cuenta.id}>
                        {cuenta.cod_cuenta} - {cuenta.cuenta}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="Debe"
                    value={detalle.debe}
                    onChange={(e) => handleDetalleChange(index, 'debe', e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="Haber"
                    value={detalle.haber}
                    onChange={(e) => handleDetalleChange(index, 'haber', e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeDetalle(index)}
                    disabled={detalles.length === 1}
                  >
                    Eliminar
                  </Button>
                </Col>
              </Row>
            ))}

            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              onClick={addDetalle}
              className="mt-2"
            >
              Agregar Línea
            </Button>

            <div className="mt-3 p-2 bg-light rounded">
              <strong>Total Debe:</strong> ${detalles.reduce((sum, det) => sum + parseFloat(det.debe || 0), 0).toLocaleString()}
              <br />
              <strong>Total Haber:</strong> ${detalles.reduce((sum, det) => sum + parseFloat(det.haber || 0), 0).toLocaleString()}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Asiento
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AsientosContables; 