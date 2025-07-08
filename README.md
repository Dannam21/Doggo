# 🐕 Doggo

**Plataforma de adopción de perros que conecta albergues con adoptantes**

Una aplicación web moderna que facilita el proceso de adopción de perros a través de un sistema de matching similar a aplicaciones de citas, permitiendo a los usuarios encontrar a su compañero canino perfecto de manera intuitiva y eficiente.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API](#-api)
- [Contribución](#-contribución)

## ✨ Características

### 👤 Para Adoptantes
- **Sistema de Swipe**: Navega entre perros con gestos intuitivos (like/dislike)
- **Matching Inteligente**: Cuando ambas partes se interesan, se crea un match automático
- **Chat en Tiempo Real**: Comunicación directa con los albergues vía WebSocket
- **Perfil Personalizado**: Gestión completa de información personal y preferencias
- **Historial de Matches**: Visualización de todas las conexiones realizadas

### 🏠 Para Albergues
- **Gestión de Perros**: CRUD completo para el manejo de perros disponibles
- **Panel de Control**: Dashboard con estadísticas y gestión de adopciones
- **Sistema de Mensajería**: Chat integrado para comunicación con adoptantes
- **Galería de Imágenes**: Subida y gestión de fotos de perros
- **Reportes**: Estadísticas de adopciones y engagement

### 🔒 Seguridad y Autenticación
- **JWT Authentication**: Sistema seguro de autenticación
- **Roles de Usuario**: Diferenciación entre adoptantes y albergues
- **Validación de Datos**: Validación robusta en frontend y backend
- **Sesiones Persistentes**: Manejo de estado de usuario

## 🚀 Tecnologías

### Frontend
- **React 18** - Biblioteca principal de UI
- **React Router Dom** - Navegación y enrutamiento
- **Tailwind CSS** - Framework de estilos utility-first
- **Context API** - Manejo de estado global
- **WebSocket** - Comunicación en tiempo real
- **Fetch API** - Peticiones HTTP

### Backend
- **FastAPI** - Framework web moderno para Python
- **SQLAlchemy** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación por tokens
- **WebSocket** - Comunicación bidireccional
- **Uvicorn** - Servidor ASGI

### Herramientas de Desarrollo
- **Vite** - Bundler y herramienta de desarrollo
- **ESLint** - Linter para JavaScript
- **Prettier** - Formateador de código

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- Python (v3.8 o superior)
- PostgreSQL
- Git

### Configuración del Frontend

```bash
# Clonar el repositorio
git clone https://github.com/Dannam21/Doggo.git
cd Doggo

# Instalar dependencias
npm install

# Configurar variables de entorno
Configura las variables en el .env
# Editar .env con tus configuraciones

# Ejecutar en modo desarrollo
npm run dev
```

### Configuración del Backend

```bash
# Navegar al directorio del backend
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn main:app --reload
```

## 🎮 Uso

### Registro y Autenticación

1. **Registro**: Crea una cuenta como adoptante o albergue
2. **Login**: Inicia sesión con tus credenciales
3. **Perfil**: Completa tu información personal

### Para Adoptantes

```bash
# Acceder al dashboard
http://localhost:3000/dashboard/user

# Explorar perros
- Desliza hacia la derecha para dar "like"
- Desliza hacia la izquierda para "dislike"
- Cuando hay match mutuo, se abre el chat automáticamente
```

### Para Albergues

```bash
# Acceder al panel de control
http://localhost:3000/dashboard/albergue

# Gestionar perros
- Agregar nuevo perro
- Editar información existente
- Subir fotografías
- Gestionar adopciones
```

## 📁 Estructura del Proyecto

```
doggo/
├── public/
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── context/          # Context API
│   ├── layout/           # Componentes de layout
│   ├── pages/            # Páginas principales
│   │   ├── auth/         # Autenticación
│   │   ├── user/         # Páginas de adoptantes
│   │   └── albergue/     # Páginas de albergues
│   ├── services/         # Servicios y API calls
│   └── utils/            # Utilidades
├── backend/
│   ├── models/           # Modelos de base de datos
│   ├── routes/           # Endpoints de API
│   ├── services/         # Lógica de negocio
│   └── utils/            # Utilidades del backend
└── docs/                 # Documentación
```

## 🔌 API

### Endpoints Principales

#### Autenticación
```
POST /auth/register     # Registro de usuario
POST /auth/login        # Inicio de sesión
GET  /auth/me          # Información del usuario actual
```

#### Perros
```
GET    /mascotas/       # Listar perros
POST   /mascotas/       # Crear perro
GET    /mascotas/{id}   # Obtener perro
PUT    /mascotas/{id}   # Actualizar perro
DELETE /mascotas/{id}   # Eliminar perro
```

#### Matches
```
GET  /matches/                    # Listar matches
POST /matches/                    # Crear match
GET  /matches/verificar/{a}/{m}   # Verificar match existente
```

#### WebSocket
```
ws://localhost:8000/ws/chat/adoptante/{id}  # Chat para adoptantes
ws://localhost:8000/ws/chat/albergue/{id}   # Chat para albergues
```

## 🛠️ Configuración

### Variables de Entorno

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

#### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost/doggo_db
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
```

## 🧪 Testing

```bash
# Frontend tests
npm run test

# Backend tests
pytest
```

## 🚀 Despliegue

### Frontend (Netlify/Vercel)
```bash
npm run build
# Subir carpeta dist/
```

### Backend (Railway/Heroku)
```bash
# Configurar variables de entorno en la plataforma
# Hacer push al repositorio conectado
```

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Convenciones de Código
- Usar **ESLint** y **Prettier** para formateo
- Seguir convenciones de **React Hooks**
- Comentarios en español para funcionalidades
- Nombres de variables y funciones en **camelCase**

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollador Full Stack** - [Tu Nombre](https://github.com/tu-usuario)

## 📞 Contacto

- **Email**: tu-email@ejemplo.com
- **LinkedIn**: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- **GitHub**: [Tu Usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Iconos por [Lucide React](https://lucide.dev)
- Diseño inspirado en aplicaciones modernas de matching
- Comunidad de React y FastAPI por su excelente documentación

---

<div align="center">
  <strong>Hecho con ❤️ para conectar perritos con hogares amorosos</strong>
</div>
</div>