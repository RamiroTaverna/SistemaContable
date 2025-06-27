#!/usr/bin/env python3
"""
Script para probar la conexión a la base de datos y crear las tablas
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import Usuario, Empresa, PlanCuentas, AsientoContable, DetalleAsiento, SubDiarioCompras, SubDiarioVentas

def test_connection():
    """Probar la conexión a la base de datos"""
    try:
        with app.app_context():
            # Intentar conectar a la base de datos
            db.engine.connect()
            print("✅ Conexión a la base de datos exitosa!")
            return True
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def create_tables():
    """Crear todas las tablas"""
    try:
        with app.app_context():
            print("Creando tablas...")
            db.create_all()
            print("✅ Tablas creadas exitosamente!")
            return True
    except Exception as e:
        print(f"❌ Error creando tablas: {e}")
        return False

def list_tables():
    """Listar las tablas existentes"""
    try:
        with app.app_context():
            # Obtener información de las tablas
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📋 Tablas existentes en la base de datos:")
            for table in tables:
                print(f"   - {table}")
            return tables
    except Exception as e:
        print(f"❌ Error listando tablas: {e}")
        return []

def main():
    print("=== Prueba de Base de Datos ===")
    print(f"URL de conexión: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print()
    
    # Probar conexión
    if not test_connection():
        print("\n🔧 Soluciones posibles:")
        print("1. Verificar que MySQL esté ejecutándose")
        print("2. Verificar que la base de datos 'sistemacontable' exista")
        print("3. Verificar usuario y contraseña")
        print("4. Verificar que el puerto 3306 esté disponible")
        return
    
    # Listar tablas existentes
    existing_tables = list_tables()
    print()
    
    # Crear tablas si no existen
    if not existing_tables:
        print("No se encontraron tablas. Creando...")
        if create_tables():
            print("\n✅ Base de datos inicializada correctamente!")
            list_tables()
        else:
            print("\n❌ Error al crear las tablas")
    else:
        print("✅ Las tablas ya existen en la base de datos")

if __name__ == "__main__":
    main() 