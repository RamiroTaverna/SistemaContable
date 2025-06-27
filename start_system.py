#!/usr/bin/env python3
"""
Script para iniciar el sistema contable completo
"""

import subprocess
import sys
import os
import time
import signal
import threading

def run_backend():
    """Ejecutar el backend Flask"""
    print("Iniciando backend...")
    os.chdir('backend')
    subprocess.run([sys.executable, 'app.py'])

def run_frontend():
    """Ejecutar el frontend React"""
    print("Iniciando frontend...")
    os.chdir('frontend')
    subprocess.run(['npm', 'start'])

def main():
    print("=== Sistema Contable Informático Online ===")
    print("Iniciando servicios...")
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists('backend') or not os.path.exists('frontend'):
        print("Error: Debe ejecutar este script desde el directorio raíz del proyecto")
        sys.exit(1)
    
    # Crear threads para ejecutar backend y frontend
    backend_thread = threading.Thread(target=run_backend)
    frontend_thread = threading.Thread(target=run_frontend)
    
    try:
        # Iniciar backend
        backend_thread.start()
        time.sleep(3)  # Esperar a que el backend se inicie
        
        # Iniciar frontend
        frontend_thread.start()
        
        print("\n=== Sistema iniciado correctamente ===")
        print("Backend: http://localhost:5000")
        print("Frontend: http://localhost:3000")
        print("Presione Ctrl+C para detener el sistema")
        
        # Mantener el script ejecutándose
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nDeteniendo el sistema...")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 