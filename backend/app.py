from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date
from decimal import Decimal
import json

from config import Config
from models import db, Usuario, Empresa, PlanCuentas, AsientoContable, DetalleAsiento, SubDiarioCompras, SubDiarioVentas

app = Flask(__name__)
app.config.from_object(Config)

# Inicializar extensiones
db.init_app(app)
jwt = JWTManager(app)
CORS(app)

# Crear tablas
with app.app_context():
    db.create_all()

# Rutas de autenticación
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if Usuario.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Usuario ya existe'}), 400
    
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email ya registrado'}), 400
    
    user = Usuario(
        username=data['username'],
        email=data['email'],
        nombre=data['nombre'],
        apellido=data['apellido'],
        rol=data.get('rol', 0)
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'Usuario registrado exitosamente'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Usuario.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'nombre': user.nombre,
                'apellido': user.apellido,
                'rol': user.rol,
                'empresa_id': user.empresa_id
            }
        }), 200
    
    return jsonify({'error': 'Credenciales inválidas'}), 401

# Rutas de empresas
@app.route('/api/empresas', methods=['POST'])
@jwt_required()
def crear_empresa():
    data = request.get_json()
    empresa = Empresa(**data)
    db.session.add(empresa)
    db.session.commit()
    return jsonify({'message': 'Empresa creada exitosamente', 'id': empresa.id}), 201

@app.route('/api/empresas', methods=['GET'])
@jwt_required()
def obtener_empresas():
    empresas = Empresa.query.filter_by(activa=True).all()
    return jsonify([{
        'id': e.id,
        'nombre': e.nombre,
        'cuit': e.cuit,
        'direccion': e.direccion,
        'telefono': e.telefono,
        'email': e.email
    } for e in empresas]), 200

# Rutas del plan de cuentas
@app.route('/api/plan-cuentas', methods=['POST'])
@jwt_required()
def crear_cuenta():
    data = request.get_json()
    cuenta = PlanCuentas(**data)
    db.session.add(cuenta)
    db.session.commit()
    return jsonify({'message': 'Cuenta creada exitosamente'}), 201

@app.route('/api/plan-cuentas/<int:empresa_id>', methods=['GET'])
@jwt_required()
def obtener_plan_cuentas(empresa_id):
    cuentas = PlanCuentas.query.filter_by(empresa_id=empresa_id, activa=True).all()
    return jsonify([{
        'id': c.id,
        'cod_rubro': c.cod_rubro,
        'rubro': c.rubro,
        'cod_subrubro': c.cod_subrubro,
        'subrubro': c.subrubro,
        'cod_cuenta': c.cod_cuenta,
        'cuenta': c.cuenta
    } for c in cuentas]), 200

# Rutas de asientos contables
@app.route('/api/asientos', methods=['POST'])
@jwt_required()
def crear_asiento():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # Validar que debe = haber
    total_debe = sum(Decimal(str(det['debe'])) for det in data['detalles'])
    total_haber = sum(Decimal(str(det['haber'])) for det in data['detalles'])
    
    if total_debe != total_haber:
        return jsonify({'error': 'El asiento no está balanceado'}), 400
    
    # Crear asiento
    asiento = AsientoContable(
        fecha=datetime.strptime(data['fecha'], '%Y-%m-%d').date(),
        num_asiento=data['num_asiento'],
        doc_respaldatorio=data.get('doc_respaldatorio'),
        datos_adjuntos=data.get('datos_adjuntos'),
        leyenda=data.get('leyenda'),
        usuario_id=user_id,
        empresa_id=data['empresa_id']
    )
    
    db.session.add(asiento)
    db.session.flush()  # Para obtener el ID del asiento
    
    # Crear detalles
    for det in data['detalles']:
        detalle = DetalleAsiento(
            asiento_id=asiento.id,
            cuenta_id=det['cuenta_id'],
            debe=det['debe'],
            haber=det['haber']
        )
        db.session.add(detalle)
    
    db.session.commit()
    return jsonify({'message': 'Asiento creado exitosamente', 'id': asiento.id}), 201

@app.route('/api/asientos/<int:empresa_id>', methods=['GET'])
@jwt_required()
def obtener_asientos(empresa_id):
    asientos = AsientoContable.query.filter_by(empresa_id=empresa_id).order_by(AsientoContable.fecha.desc()).all()
    return jsonify([{
        'id': a.id,
        'fecha': a.fecha.strftime('%Y-%m-%d'),
        'num_asiento': a.num_asiento,
        'doc_respaldatorio': a.doc_respaldatorio,
        'datos_adjuntos': a.datos_adjuntos,
        'leyenda': a.leyenda,
        'usuario': f"{a.usuario.nombre} {a.usuario.apellido}",
        'detalles': [{
            'cuenta': d.cuenta.cuenta,
            'debe': float(d.debe),
            'haber': float(d.haber)
        } for d in a.detalles]
    } for a in asientos]), 200

# Rutas de sub-diarios
@app.route('/api/compras', methods=['POST'])
@jwt_required()
def crear_compra():
    data = request.get_json()
    compra = SubDiarioCompras(**data)
    db.session.add(compra)
    db.session.commit()
    return jsonify({'message': 'Compra registrada exitosamente'}), 201

@app.route('/api/ventas', methods=['POST'])
@jwt_required()
def crear_venta():
    data = request.get_json()
    venta = SubDiarioVentas(**data)
    db.session.add(venta)
    db.session.commit()
    return jsonify({'message': 'Venta registrada exitosamente'}), 201

@app.route('/api/compras/<int:empresa_id>', methods=['GET'])
@jwt_required()
def obtener_compras(empresa_id):
    compras = SubDiarioCompras.query.filter_by(empresa_id=empresa_id).order_by(SubDiarioCompras.fecha.desc()).all()
    return jsonify([{
        'id': c.id,
        'doc_respaldatorio': c.doc_respaldatorio,
        'fecha': c.fecha.strftime('%Y-%m-%d'),
        'contacto': c.contacto,
        'importe': float(c.importe),
        'condicion': c.condicion
    } for c in compras]), 200

@app.route('/api/ventas/<int:empresa_id>', methods=['GET'])
@jwt_required()
def obtener_ventas(empresa_id):
    ventas = SubDiarioVentas.query.filter_by(empresa_id=empresa_id).order_by(SubDiarioVentas.fecha.desc()).all()
    return jsonify([{
        'id': v.id,
        'doc_respaldatorio': v.doc_respaldatorio,
        'fecha': v.fecha.strftime('%Y-%m-%d'),
        'contacto': v.contacto,
        'importe': float(v.importe),
        'condicion': v.condicion
    } for v in ventas]), 200

# Rutas de reportes
@app.route('/api/reportes/libro-mayor/<int:empresa_id>', methods=['GET'])
@jwt_required()
def libro_mayor(empresa_id):
    # Obtener todas las cuentas de la empresa
    cuentas = PlanCuentas.query.filter_by(empresa_id=empresa_id, activa=True).all()
    resultado = []
    
    for cuenta in cuentas:
        # Obtener todos los movimientos de la cuenta
        movimientos = db.session.query(
            AsientoContable.fecha,
            AsientoContable.num_asiento,
            DetalleAsiento.debe,
            DetalleAsiento.haber
        ).join(DetalleAsiento).filter(
            DetalleAsiento.cuenta_id == cuenta.id,
            AsientoContable.empresa_id == empresa_id
        ).order_by(AsientoContable.fecha, AsientoContable.num_asiento).all()
        
        saldo = Decimal('0')
        movimientos_con_saldo = []
        
        for mov in movimientos:
            saldo += mov.debe - mov.haber
            movimientos_con_saldo.append({
                'fecha': mov.fecha.strftime('%Y-%m-%d'),
                'num_asiento': mov.num_asiento,
                'debe': float(mov.debe),
                'haber': float(mov.haber),
                'saldo': float(saldo)
            })
        
        resultado.append({
            'cuenta': cuenta.cuenta,
            'cod_cuenta': cuenta.cod_cuenta,
            'movimientos': movimientos_con_saldo,
            'saldo_final': float(saldo)
        })
    
    return jsonify(resultado), 200

@app.route('/api/reportes/estado-situacion/<int:empresa_id>', methods=['GET'])
@jwt_required()
def estado_situacion_patrimonial(empresa_id):
    # Agrupar cuentas por rubro y calcular saldos
    cuentas = PlanCuentas.query.filter_by(empresa_id=empresa_id, activa=True).all()
    resultado = {}
    
    for cuenta in cuentas:
        # Calcular saldo de la cuenta
        saldo = db.session.query(
            db.func.sum(DetalleAsiento.debe - DetalleAsiento.haber)
        ).join(AsientoContable).filter(
            DetalleAsiento.cuenta_id == cuenta.id,
            AsientoContable.empresa_id == empresa_id
        ).scalar() or Decimal('0')
        
        if cuenta.cod_rubro not in resultado:
            resultado[cuenta.cod_rubro] = {
                'rubro': cuenta.rubro,
                'subrubros': {}
            }
        
        if cuenta.cod_subrubro not in resultado[cuenta.cod_rubro]['subrubros']:
            resultado[cuenta.cod_rubro]['subrubros'][cuenta.cod_subrubro] = {
                'subrubro': cuenta.subrubro,
                'cuentas': []
            }
        
        resultado[cuenta.cod_rubro]['subrubros'][cuenta.cod_subrubro]['cuentas'].append({
            'cod_cuenta': cuenta.cod_cuenta,
            'cuenta': cuenta.cuenta,
            'saldo': float(saldo)
        })
    
    return jsonify(resultado), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 