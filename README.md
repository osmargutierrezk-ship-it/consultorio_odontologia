# 🌿 LumiPlus — Clínica Psicológica y Dental

> Plataforma web full-stack para la clínica LumiPlus en Guatemala City.  
> Stack: React + Vite · Node/Express · PostgreSQL · Prisma · Docker · Render

---

## 📦 Estructura del proyecto

```
lumiplus/
├── frontend/               # React + Vite + TailwindCSS + Framer Motion
│   ├── src/
│   │   ├── components/     # Navbar, Hero, Services, Specialists, Contact, Footer
│   │   ├── pages/          # HomePage, AppointmentPage
│   │   └── index.css       # Variables globales + Tailwind
│   ├── nginx.conf          # Config Nginx para SPA
│   └── Dockerfile
├── backend/                # Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/         # services, specialists, appointments, contact
│   │   └── index.js        # Entry point Express
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Inicio rápido (Docker)

### 1. Clonar y configurar variables

```bash
git clone https://github.com/tu-usuario/lumiplus.git
cd lumiplus

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus valores
nano .env
```

### 2. Agregar imágenes

Coloca las imágenes en estas rutas dentro de `frontend/public/`:

```
frontend/public/
├── assets/
│   ├── carrusel/
│   │   ├── img1.webp   ← Imagen hero 1
│   │   ├── img2.webp   ← Imagen hero 2
│   │   └── img3.webp   ← Imagen hero 3
│   ├── specialists/
│   │   ├── aaron.webp
│   │   └── nohemi.webp
│   └── clinic/
│       └── interior.webp
└── favicon.svg
```

### 3. Levantar con Docker Compose

```bash
docker-compose up --build
```

- **Frontend:** http://localhost
- **Backend API:** http://localhost:3000
- **Base de datos:** localhost:5432

### 4. Seed de base de datos

```bash
docker-compose exec backend npm run prisma:seed
```

---

## ☁️ Despliegue en Render

### Backend (Web Service)

| Campo | Valor |
|---|---|
| **Runtime** | Node |
| **Build Command** | `npm ci && npx prisma generate && npx prisma migrate deploy` |
| **Start Command** | `node src/index.js` |
| **Root Directory** | `backend` |

**Variables de entorno en Render:**
```
DATABASE_URL=postgresql://USER:PASS@HOST:PORT/DB
PORT=3000
JWT_SECRET=tu_secreto_64_chars
FRONTEND_URL=https://lumiplus.onrender.com
NODE_ENV=production
```

### Frontend (Static Site)

| Campo | Valor |
|---|---|
| **Build Command** | `npm ci && npm run build` |
| **Publish Directory** | `dist` |
| **Root Directory** | `frontend` |

**Variables de entorno en Render:**
```
VITE_API_URL=https://lumiplus-api.onrender.com
VITE_GOOGLE_MAPS_KEY=tu_google_maps_key
```

### Base de datos

Usar **Render PostgreSQL** (plan gratuito disponible).  
Copiar el **Internal Database URL** como `DATABASE_URL` en el backend.

---

## 🔌 API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/services` | Listar servicios |
| `GET` | `/api/services/:slug` | Servicio por slug |
| `GET` | `/api/specialists` | Listar especialistas |
| `GET` | `/api/specialists/:id` | Especialista por ID |
| `POST` | `/api/appointments` | Crear cita |
| `GET` | `/api/contact` | Información de contacto |
| `POST` | `/api/contact` | Enviar mensaje |

### Ejemplo: Crear cita

```json
POST /api/appointments
{
  "name": "María García",
  "phone": "5555-1234",
  "email": "maria@ejemplo.com",
  "date": "2024-06-15T10:00:00",
  "service": "Psicología clínica",
  "message": "Primera consulta"
}
```

---

## 🎨 Diseño

| Token | Valor |
|---|---|
| Primary (verde) | `#3D5A45` |
| Gold | `#C9A84C` |
| Beige | `#F5F0E8` |
| Forest | `#2C3E35` |
| Fuente display | Cormorant Garamond |
| Fuente body | DM Sans |

---

## 🗺️ Google Maps

1. Obtener API key en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar **Maps JavaScript API** y **Maps Embed API**
3. Agregar la key como `VITE_GOOGLE_MAPS_KEY` en `.env`
4. Opcional: reemplazar el iframe en `Contact.jsx` con `@react-google-maps/api`

---

## 📱 Funcionalidades

- ✅ Carrusel hero con autoplay (Framer Motion)
- ✅ Formulario de citas con validación (React Hook Form + Zod)
- ✅ Animaciones fade-up en scroll (Framer Motion)
- ✅ Navbar responsive con menú hamburguesa
- ✅ Mapa integrado (Google Maps iframe)
- ✅ Botón WhatsApp directo
- ✅ SEO básico (react-helmet-async)
- ✅ Rate limiting en API
- ✅ Lazy loading de imágenes
- ✅ Manejo de errores en frontend

---

## 🛠️ Desarrollo local (sin Docker)

```bash
# Backend
cd backend
npm install
cp .env.example .env  # editar DATABASE_URL
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

---

*Hecho con ❤️ para LumiPlus — Guatemala City*
