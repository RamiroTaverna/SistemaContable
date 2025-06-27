from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    rol = db.Column(db.Integer, default=0)  # 0=usuario, 1=admin
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=True)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    activo = db.Column(db.Boolean, default=True)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Empresa(db.Model):
    __tablename__ = 'empresas'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    cuit = db.Column(db.String(20), unique=True, nullable=True)
    direccion = db.Column(db.String(200), nullable=True)
    telefono = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    activa = db.Column(db.Boolean, default=True)

class PlanCuentas(db.Model):
    __tablename__ = 'plan_cuentas'
    
    id = db.Column(db.Integer, primary_key=True)
    cod_rubro = db.Column(db.String(10), nullable=False)
    rubro = db.Column(db.String(100), nullable=False)
    cod_subrubro = db.Column(db.String(10), nullable=False)
    subrubro = db.Column(db.String(100), nullable=False)
    cod_cuenta = db.Column(db.String(10), nullable=False)
    cuenta = db.Column(db.String(100), nullable=False)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)
    activa = db.Column(db.Boolean, default=True)

class AsientoContable(db.Model):
    __tablename__ = 'asientos_contables'
    
    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.Date, nullable=False)
    num_asiento = db.Column(db.Integer, nullable=False)
    doc_respaldatorio = db.Column(db.String(200), nullable=True)
    datos_adjuntos = db.Column(db.Text, nullable=True)
    leyenda = db.Column(db.String(500), nullable=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación con los detalles del asiento
    detalles = db.relationship('DetalleAsiento', backref='asiento', lazy=True, cascade='all, delete-orphan')

class DetalleAsiento(db.Model):
    __tablename__ = 'detalles_asiento'
    
    id = db.Column(db.Integer, primary_key=True)
    asiento_id = db.Column(db.Integer, db.ForeignKey('asientos_contables.id'), nullable=False)
    cuenta_id = db.Column(db.Integer, db.ForeignKey('plan_cuentas.id'), nullable=False)
    debe = db.Column(db.Numeric(15, 2), default=0)
    haber = db.Column(db.Numeric(15, 2), default=0)
    
    # Relación con la cuenta
    cuenta = db.relationship('PlanCuentas')

class SubDiarioCompras(db.Model):
    __tablename__ = 'sub_diario_compras'
    
    id = db.Column(db.Integer, primary_key=True)
    doc_respaldatorio = db.Column(db.String(200), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    contacto = db.Column(db.String(200), nullable=True)
    importe = db.Column(db.Numeric(15, 2), nullable=False)
    condicion = db.Column(db.String(100), nullable=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)

class SubDiarioVentas(db.Model):
    __tablename__ = 'sub_diario_ventas'
    
    id = db.Column(db.Integer, primary_key=True)
    doc_respaldatorio = db.Column(db.String(200), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    contacto = db.Column(db.String(200), nullable=True)
    importe = db.Column(db.Numeric(15, 2), nullable=False)
    condicion = db.Column(db.String(100), nullable=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow) 