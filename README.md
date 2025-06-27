# Sistema Contable Informático Online

Sistema contable web desarrollado en Python (Flask) y React para la gestión de asientos contables, plan de cuentas, sub-diarios y reportes financieros.

## Características

- **Gestión de Usuarios**: Registro, login y control de acceso
- **Plan de Cuentas**: Administración completa del plan contable
- **Asientos Contables**: Creación y gestión de asientos con validación automática
- **Sub-Diarios**: Registro de compras y ventas
- **Reportes**: Libro diario, libro mayor, estados contables y análisis de índices
- **Exportación**: Generación de reportes en PDF y Excel
- **Dashboard**: Indicadores clave y gráficos de evolución

## Tecnologías Utilizadas

### Backend
- Python 3.8+
- Flask (Framework web)
- SQLAlchemy (ORM)
- PyMySQL (Conexión MySQL)
- Flask-JWT-Extended (Autenticación)
- Flask-Bcrypt (Encriptación)

### Frontend
- React 18
- React Router (Navegación)
- React Bootstrap (UI Components)
- Axios (HTTP Client)
- Recharts (Gráficos)
- jsPDF (Generación PDF)

### Base de Datos
- MySQL 8.0+

## Instalación

### Prerrequisitos
- Python 3.8 o superior
- Node.js 16 o superior
- MySQL 8.0 o superior
- Git

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd SistemaContable
```

### 2. Configurar la base de datos
1. Crear una base de datos MySQL llamada `sistemacontable`
2. Configurar las credenciales en `backend/config.py` o usar las variables de entorno:
   ```bash
   export DATABASE_URL="mysql+pymysql://root:41054105@localhost:3306/sistemacontable"
   ```

### 3. Configurar el Backend
```bash
cd backend
pip install -r requirements.txt
python init_db.py  # Inicializar base de datos con datos de ejemplo
python app.py      # Ejecutar el servidor (puerto 5000)
```

### 4. Configurar el Frontend
```bash
cd frontend
npm install
npm start  # Ejecutar en modo desarrollo (puerto 3000)
```

## Uso

### Acceso al Sistema
- **URL**: http://localhost:3000
- **Usuario Admin**: admin / admin123
- **Usuario Normal**: usuario / usuario123

### Funcionalidades Principales

#### 1. Dashboard
- Resumen de asientos, compras y ventas
- Gráficos de distribución patrimonial
- Lista de asientos recientes

#### 2. Plan de Cuentas
- Crear y gestionar cuentas contables
- Organización por rubros y subrubros
- Códigos de cuenta personalizables

#### 3. Asientos Contables
- Crear asientos con múltiples líneas
- Validación automática de balance (Debe = Haber)
- Documentos respaldatorios y leyendas

#### 4. Sub-Diarios
- Registro de compras con proveedores
- Registro de ventas con clientes
- Control de condiciones de pago

#### 5. Reportes
- **Libro Diario**: Listado cronológico de asientos
- **Libro Mayor**: Movimientos por cuenta con saldos
- **Estado de Situación Patrimonial**: Balance general
- **Estado de Resultados**: Pérdidas y ganancias
- **Análisis de Índices**: Ratios financieros

## Estructura del Proyecto

```
SistemaContable/
├── backend/
│   ├── app.py              # Aplicación principal Flask
│   ├── config.py           # Configuración
│   ├── models.py           # Modelos de base de datos
│   ├── init_db.py          # Script de inicialización
│   └── requirements.txt    # Dependencias Python
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── contexts/       # Contextos (Auth)
│   │   └── App.js          # Componente principal
│   └── package.json        # Dependencias Node.js
├── sistema_screens/        # Capturas del sistema original
└── README.md
```

## Configuración de Producción

### Variables de Entorno
```bash
# Backend
export SECRET_KEY="tu-clave-secreta-muy-segura"
export JWT_SECRET_KEY="tu-jwt-secret-key"
export DATABASE_URL="mysql+pymysql://usuario:password@host:puerto/database"

# Frontend
export REACT_APP_API_URL="https://tu-api.com"
```

### Despliegue
1. **Backend**: Usar Gunicorn o uWSGI con Nginx
2. **Frontend**: Build de producción con `npm run build`
3. **Base de Datos**: Configurar MySQL con respaldos automáticos

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico o consultas, contactar a:
- Email: soporte@sistemacontable.com
- Documentación: [Wiki del proyecto]

## Changelog

### v1.0.0 (2024-01-15)
- Versión inicial del sistema
- Funcionalidades básicas de contabilidad
- Interfaz web responsive
- Reportes básicos
