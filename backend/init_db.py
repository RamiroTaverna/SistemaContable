#!/usr/bin/env python3
"""
Script para inicializar la base de datos con datos de ejemplo
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import Usuario, Empresa, PlanCuentas
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def init_database():
    with app.app_context():
        # Crear tablas
        db.create_all()
        
        # Crear empresa de ejemplo
        empresa = Empresa(
            nombre="Empresa Ejemplo S.A.",
            cuit="20-12345678-9",
            direccion="Av. Principal 123, Ciudad",
            telefono="+54 11 1234-5678",
            email="info@empresaejemplo.com"
        )
        db.session.add(empresa)
        db.session.flush()  # Para obtener el ID
        
        # Crear usuario administrador
        admin = Usuario(
            username="admin",
            email="admin@sistema.com",
            nombre="Administrador",
            apellido="Sistema",
            rol=1,
            empresa_id=empresa.id
        )
        admin.set_password("admin123")
        db.session.add(admin)
        
        # Crear usuario normal
        usuario = Usuario(
            username="usuario",
            email="usuario@sistema.com",
            nombre="Usuario",
            apellido="Normal",
            rol=0,
            empresa_id=empresa.id
        )
        usuario.set_password("usuario123")
        db.session.add(usuario)
        
        # Crear plan de cuentas básico
        cuentas_basicas = [
            # Activos
            ("1", "ACTIVO", "11", "ACTIVO CORRIENTE", "1101", "Caja"),
            ("1", "ACTIVO", "11", "ACTIVO CORRIENTE", "1102", "Banco"),
            ("1", "ACTIVO", "12", "CRÉDITOS", "1201", "Deudores por Ventas"),
            ("1", "ACTIVO", "13", "BIENES DE CAMBIO", "1301", "Mercaderías"),
            
            # Pasivos
            ("2", "PASIVO", "21", "PASIVO CORRIENTE", "2101", "Proveedores"),
            ("2", "PASIVO", "21", "PASIVO CORRIENTE", "2102", "Impuestos a Pagar"),
            ("2", "PASIVO", "22", "PASIVO NO CORRIENTE", "2201", "Préstamos Bancarios"),
            
            # Patrimonio Neto
            ("3", "PATRIMONIO NETO", "31", "CAPITAL", "3101", "Capital Social"),
            ("3", "PATRIMONIO NETO", "32", "RESULTADOS", "3201", "Resultado del Ejercicio"),
            
            # Ingresos
            ("4", "INGRESOS", "41", "INGRESOS POR VENTAS", "4101", "Ventas"),
            ("4", "INGRESOS", "42", "OTROS INGRESOS", "4201", "Intereses Ganados"),
            
            # Costos y Gastos
            ("5", "COSTOS Y GASTOS", "51", "COSTO DE VENTAS", "5101", "Costo de Mercaderías Vendidas"),
            ("5", "COSTOS Y GASTOS", "52", "GASTOS DE ADMINISTRACIÓN", "5201", "Sueldos y Jornales"),
            ("5", "COSTOS Y GASTOS", "52", "GASTOS DE ADMINISTRACIÓN", "5202", "Alquileres"),
            ("5", "COSTOS Y GASTOS", "53", "GASTOS DE COMERCIALIZACIÓN", "5301", "Publicidad"),
        ]
        
        for cod_rubro, rubro, cod_subrubro, subrubro, cod_cuenta, cuenta in cuentas_basicas:
            plan_cuenta = PlanCuentas(
                cod_rubro=cod_rubro,
                rubro=rubro,
                cod_subrubro=cod_subrubro,
                subrubro=subrubro,
                cod_cuenta=cod_cuenta,
                cuenta=cuenta,
                empresa_id=empresa.id
            )
            db.session.add(plan_cuenta)
        
        # Commit todos los cambios
        db.session.commit()
        
        print("Base de datos inicializada exitosamente!")
        print("\nUsuarios creados:")
        print("Admin - Usuario: admin, Contraseña: admin123")
        print("Usuario - Usuario: usuario, Contraseña: usuario123")
        print("\nEmpresa creada: Empresa Ejemplo S.A.")
        print("Plan de cuentas básico creado con 15 cuentas")

if __name__ == "__main__":
    init_database() 