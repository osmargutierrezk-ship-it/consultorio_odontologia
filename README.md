# 🌿 LumiPlus — Fullstack Docker (Render Ready)

Aplicación fullstack para clínica psicológica y dental, preparada para desplegarse en **Render** con **un solo contenedor Docker**.

## ✅ Cambios de arquitectura aplicados

- Unificación en **single-container fullstack**.
- El frontend (Vite) se compila dentro del build Docker.
- Express sirve el build de frontend desde `backend/public`.
- Eliminado Nginx como capa de producción.
- Eliminado `docker-compose` del flujo de producción.
- Configuración para PostgreSQL externa (Render DB) mediante `DATABASE_URL`.
- Arranque robusto con Prisma (`prisma migrate deploy` al iniciar).
- Carrusel Hero migrado a **Swiper.js**.
- Pipeline de assets: copia de `frontend/src/assets` a `frontend/public/assets` antes del build.
- Middleware de seguridad activo (`helmet`, `cors`, `express-rate-limit`).

---

## 📦 Estructura principal

```bash
lumiplus/
├── Dockerfile                # Build + runtime fullstack
├── .dockerignore
├── .env.example
├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
└── frontend/
    ├── public/assets/
    ├── scripts/copyAssets.mjs
    ├── src/
    └── package.json
```

---

## 🚀 Despliegue en Render (recomendado)

Crear un **Web Service** en Render usando Docker:

- **Environment**: `Docker`
- **Root Directory**: `lumiplus` (o la carpeta raíz del proyecto)
- **Dockerfile Path**: `./Dockerfile`

### Variables de entorno (Render)

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
PORT=3000
NODE_ENV=production
JWT_SECRET=tu_secreto_largo_y_seguro
FRONTEND_URL=https://tu-servicio.onrender.com
# opcional para build del frontend
VITE_API_URL=
VITE_GOOGLE_MAPS_KEY=tu_google_maps_key
```

> `VITE_API_URL` puede quedar vacío para consumir `/api/*` por mismo dominio.

---

## 🧪 Ejecución local con Docker

```bash
docker build -t lumiplus-fullstack .
docker run --rm -p 3000:3000 --env-file .env lumiplus-fullstack
```

App disponible en: `http://localhost:3000`

---

## 🛡️ Seguridad y API

- `helmet` para headers de seguridad.
- `cors` con whitelist configurable por `FRONTEND_URL`.
- `express-rate-limit` en `/api/*`.
- Endpoints API disponibles bajo `/api/...`.
- Frontend SPA servido por Express para rutas no-API.

---

## 📌 Nota sobre assets

Si agregas imágenes en `frontend/src/assets`, durante `npm run build` se copian a `frontend/public/assets` automáticamente.

También puedes colocar assets manualmente en:

```bash
frontend/public/assets/carrusel/
frontend/public/assets/specialists/
frontend/public/assets/clinic/
```

---

Hecho para despliegue simplificado y estable en Render ✅
