# Lifto

**Train. Track. Progress.**

Lifto es una aplicación de seguimiento de entrenamientos de gimnasio y peso corporal. Planifica tus rutinas, registra cada sesión con series y repeticiones reales, y sigue tu progreso de peso corporal — todo con tus propios datos.

Proyecto personal desarrollado como ejercicio práctico simulando un flujo de trabajo profesional real (fases, versiones, documentación), inspirado en [openGym](https://gitlab.com/DuarteSantos8/opengym).

## Estado del proyecto

🚧 En desarrollo — **MVP funcional completo** (backend + frontend en móvil). Pendiente: diseño visual, superseries/drop-sets/progresión automática, passkeys, self-hosting con Docker y app móvil nativa.

## Funcionalidad actual

- Registro e inicio de sesión (JWT)
- Creación y gestión de rutinas, con ejercicios propios
- Registro de entrenamientos en tiempo real (serie a serie: reps, peso)
- Seguimiento de peso corporal con gráfico de evolución
- Navegación completa en móvil (tab bar)

## Stack técnico

- **Frontend:** React + TanStack Query + React Router
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** PostgreSQL + Prisma
- **Autenticación:** JWT (fase futura: passkeys / WebAuthn)
- **Infraestructura:** Docker (PostgreSQL local vía docker-compose)
- **Infraestructura futura:** self-hosting completo con Docker, Capacitor (app móvil)

## Instalación y ejecución en local

Requisitos: Node.js 24+, Docker.

```bash
git clone https://github.com/AlvaroS19/Lifto.git
cd Lifto

# 1. Base de datos
docker compose up -d

# 2. Backend
cd backend
npm install
cp .env.example .env   # completa DATABASE_URL y JWT_SECRET
npx prisma generate
npx prisma migrate deploy
npm run dev             # http://localhost:3000

# 3. Frontend (en otra terminal)
cd ../frontend
npm install
npm run dev              # http://localhost:5173
```

## Documentación

- [Brief del proyecto](docs/brief.md)
- [Modelo de datos](docs/data-model.md)
- [Decisiones técnicas](docs/decisions/)
- [Changelog](CHANGELOG.md)

## Roadmap

- [x] **v0.1** — MVP: rutinas, logs de entrenamiento, seguimiento de peso, auth con JWT
- [ ] **v0.2** — Superseries, drop-sets, rest-pause, cardio, esquemas de progresión
- [ ] **v0.3** — Autenticación con passkeys / WebAuthn
- [ ] **v0.4** — Dockerización completa / self-hosted
- [ ] **v0.5** — App móvil con Capacitor

## Licencia

_Pendiente de definir._
