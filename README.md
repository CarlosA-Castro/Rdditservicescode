README - PRUEBA TÉCNICA COMPLETADA

# 🚀 Reddit App - Prueba Técnica Fullstack

Aplicación web completa que consume la API de Reddit, almacena datos en MySQL y muestra una interfaz moderna con React.

## ✨ Características Implementadas

### ✅ Requisitos Mínimos Cumplidos
- **Consumo de API de Reddit** - JSON de r/programming
- **Almacenamiento en MySQL** - Tablas normalizadas
- **API REST completa** - Endpoints con paginación
- **Frontend React** - Interfaz moderna y responsive
- **Proyecto en GitHub** - Con documentación completa

### 🎁 Extras Implementados
- **🔍 Filtros de Búsqueda** - Por autor, score, comentarios y texto
- **🧪 Tests Unitarios** - 3 tests backend + 2 tests frontend
- **🎨 Diseño con Material-UI** - Interfaz profesional y responsive
- **⚡ Manejo de Errores** - Elegante e informativo
- **📱 Paginación Avanzada** - Navegación completa entre páginas

## 🛠️ Stack Tecnológico

- **Backend**: Node.js + Express + MySQL2
- **Frontend**: React 19 + Material-UI + Axios
- **Base de datos**: MySQL 8+
- **Testing**: Jest + Testing Library
- **Autenticación**: JWT (configurado)

## 📦 Instalación Rápida

### Prerrequisitos
- Node.js 18+
- MySQL 8+
- npm o yarn

### 1. Clonar y configurar
```bash
git clone https://github.com/CarlosA-Castro/Rdditsservicescode.git
cd Rdditsservicescode
2. Configurar base de datos
sql
CREATE DATABASE reddit_db;
USE reddit_db;

CREATE TABLE posts (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_utc BIGINT NOT NULL,
    num_comments INT DEFAULT 0,
    score INT DEFAULT 0,
    url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
3. Configurar backend
bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales MySQL
4. Configurar frontend
bash
cd ../frontend
npm install
5. Ejecutar la aplicación
bash
# Terminal 1 - Backend (puerto 5001)
cd backend && npm start

# Terminal 2 - Frontend (puerto 3000)  
cd frontend && npm start
🔌 API Endpoints
📋 Posts
GET /api/posts - Listar posts con paginación

GET /api/posts/:id - Obtener post específico

GET /api/posts/sync - Sincronizar con Reddit

🔍 Filtros de Búsqueda
?author=username - Filtrar por autor

?min_score=100 - Score mínimo

?min_comments=50 - Comentarios mínimos

?search=keyword - Búsqueda en títulos

?page=2&limit=20 - Paginación

💬 Autenticación (JWT)
POST /api/auth/login - Login de usuario

GET /api/auth/verify - Verificar token

🧪 Tests Implementados
✅ Backend Tests (3 tests pasando)
bash
cd backend
npm test
Tests básicos - Operaciones y entorno

Tests de API - Endpoints y respuestas

Tests de estructura - Verificación de rutas

✅ Frontend Tests (2 tests pasando)
bash
cd frontend
npm test -- --watchAll=false
Tests de componentes - Renderizado básico

Tests de funcionalidad - Estados y props

🎨 Interfaz de Usuario
📱 Vista Principal
Lista de posts con paginación

Información de autor, score y comentarios

Botones para ver artículo y comentarios

Diseño responsive para móviles y desktop

🔍 Vista de Detalle
Información completa del post

Acceso a comentarios

Enlace a Reddit original

Navegación intuitiva

📊 Estructura del Proyecto
text
Rdditsservicescode/
├── backend/
│   ├── controllers/     # Lógica de endpoints
│   ├── routes/         # Definición de rutas
│   ├── services/       # Servicios de Reddit
│   ├── middleware/     # Autenticación JWT
│   ├── tests/          # Tests unitarios
│   └── server.js       # Servidor principal
├── frontend/
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── tests/      # Tests frontend
│   │   ├── App.js      # Componente principal
│   │   └── index.js    # Punto de entrada
│   └── public/         # Archivos estáticos
└── README.md
🚀 Despliegue
Backend en Render/Vercel
Conectar repositorio GitHub

Configurar variables de entorno

Deploy automático

Frontend en Vercel/Netlify
bash
cd frontend
npm run build
# Subir carpeta build a plataforma
👨‍💻 Autor
Carlos Castro - GitHub

📄 Licencia
Este proyecto fue creado para fines de prueba técnica. Desarrollado con ❤️ usando React y Node.js.
