# Image Processing App

Este proyecto es una aplicación web para subir, procesar y gestionar imágenes, compuesta por un **Backend** (Node.js + Express + MongoDB) y un **Frontend** (React + Vite).

---

## Requisitos previos

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

---

## 1. Clonar el repositorio

```sh
git clone <URL_DEL_REPOSITORIO>
cd <carpeta_del_proyecto>
```

---

## 2. Configuración del Backend

### a) Instalar dependencias

```sh
cd Backend
npm install
```

### b) Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y completa los valores necesarios:

```sh
cp .env.example .env
```

Ejemplo de `.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/imageProcessing
JWT_SECRET=tuSuperSecretoMuyLargoYUnico
JWT_EXPIRES_IN=1h
```

Asegúrate de que MongoDB esté corriendo en tu máquina o usa una URI de Atlas.

### c) Compilar TypeScript

```sh
npm run build
```

### d) Iniciar el servidor

En modo desarrollo (con recarga automática):

```sh
npm run dev
```

En modo producción (después de compilar):

```sh
npm start
```

El backend estará disponible en:  
`http://localhost:3000/api`

---

## 3. Configuración del Frontend

### a) Instalar dependencias

```sh
cd ../Frontend
npm install
```

### b) Configurar variables de entorno

Crea un archivo `.env` en la carpeta `Frontend` (opcional, solo si quieres cambiar la URL del backend):

```
VITE_API_BASE_URL=http://localhost:3000/api
```

### c) Iniciar la aplicación React

```sh
npm run dev
```

El frontend estará disponible en:  
`http://localhost:5173`

---

## 4. Flujo de uso

1. Regístrate o inicia sesión en la aplicación web.
2. Sube imágenes desde el dashboard.
3. Visualiza las imágenes procesadas y sus transformaciones.

---

## Notas

- Las imágenes originales y procesadas se almacenan en `Backend/public/uploads/originals` y `Backend/public/uploads/processed`.
- Si tienes problemas de CORS, asegúrate de que las URLs en los archivos `.env` coincidan y que el backend permita el origen del frontend.
- Para producción, configura correctamente las variables de entorno y considera usar HTTPS.

---

## Scripts útiles

### Backend

- `npm run dev` — Inicia el backend en modo desarrollo (con nodemon)
- `npm run build` — Compila TypeScript a JavaScript
- `npm start` — Inicia el backend en modo producción

### Frontend

- `npm run dev` — Inicia el frontend en modo desarrollo
- `npm run build` — Compila el frontend para producción
- `npm run preview` — Previsualiza el frontend compilado

---

## Licencia

MIT
