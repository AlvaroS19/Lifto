# Brief del Proyecto — Lifto

**Lema:** Train. Track. Progress.
**Cliente:** Álvaro Delgado (proyecto interno / portfolio)
**Fecha:** Agosto 2026
**Versión del documento:** 1.1

---

## 1. Contexto y objetivo

El cliente necesita una aplicación de seguimiento de entrenamientos de gimnasio y peso corporal, autoalojada (self-hosted), que le permita:

- Planificar rutinas de entrenamiento propias.
- Registrar sesiones de entrenamiento reales (series, repeticiones, peso levantado), incluyendo superseries y ejercicios de cardio.
- Llevar un histórico de su peso corporal y visualizar su progreso a lo largo del tiempo.
- Acceder a la aplicación de forma segura sin depender de contraseñas tradicionales.

El proyecto nace inspirado en herramientas existentes del mercado (como openGym), pero se construye desde cero como ejercicio de aprendizaje técnico, documentado como si fuera un encargo profesional real.

**Problema que resuelve:** las apps de fitness comerciales suelen depender de servicios en la nube de terceros, tener funcionalidades de pago o no dar control total sobre los datos del usuario. Esta aplicación da control total al usuario sobre su propio historial de entrenamiento.

**Usuario objetivo:** una única persona (uso personal), con perfil técnico, que entrena de forma autogestionada (sin necesidad de funcionalidades sociales, entrenadores, ni multiusuario en el MVP).

---

## 2. Alcance del MVP (v0.1)

### Dentro del alcance
- Registro y login de usuario (autenticación simple con JWT).
- CRUD de rutinas: crear una rutina compuesta por una lista de ejercicios.
- CRUD de ejercicios dentro de una rutina (nombre, series, repeticiones objetivo, peso objetivo).
- Registro de sesiones de entrenamiento (log): al entrenar, el usuario registra lo que realmente hizo (series, reps y peso reales) por ejercicio.
- Registro de peso corporal con fecha.
- Vista de histórico/progreso básico (lista o gráfico simple de peso a lo largo del tiempo).

### Fuera de alcance del MVP (fases futuras)
- Superseries (agrupar varios ejercicios en un mismo bloque), drop-sets y rest-pause.
- Registro específico de cardio (distancia, duración, ritmo).
- Esquemas de progresión configurables (Linear, Greyskull LP, doble progresión, progresión por tiempo).
- Login con passkeys / WebAuthn.
- Dockerización para self-hosting.
- Versión móvil vía Capacitor.
- Estadísticas avanzadas (gráficos de progresión por ejercicio, PRs, volumen total).

### Nota sobre el alcance funcional respecto al proyecto original (openGym)
Lifto replica el alcance funcional completo de openGym, pero de forma acotada y realista para un proyecto individual, no una copia literal:
- **Base de datos de ejercicios:** propia y reducida (decenas, no las 1.324 del original), sin animaciones ni multi-idioma. Pendiente de definir la fuente de vídeos/animaciones (gratuita) — en estudio.
- **App móvil (Capacitor):** build funcional para demo, sin firma ni publicación en Play Store.
- **Idioma:** español (o español + inglés para el portfolio), sin i18n multi-idioma.
- **Fuera de alcance por completo:** servidor MCP (funcionalidad muy específica del proyecto original, no aporta valor al portfolio).

---

## 3. User stories del MVP

| # | Historia | Prioridad |
|---|----------|-----------|
| 1 | Como usuario, quiero registrarme e iniciar sesión, para tener mis datos protegidos y accesibles solo por mí. | Alta |
| 2 | Como usuario, quiero crear una rutina con una lista de ejercicios, para tener un plan definido antes de entrenar. | Alta |
| 3 | Como usuario, quiero registrar lo que hago en cada sesión de entrenamiento (series, reps, peso), para llevar un histórico real de mi rendimiento. | Alta |
| 4 | Como usuario, quiero registrar mi peso corporal con fecha, para hacer seguimiento de mi progreso físico. | Alta |
| 5 | Como usuario, quiero ver un listado o gráfico simple de mi evolución de peso, para valorar mi progreso de un vistazo. | Media |
| 6 | Como usuario, quiero editar o eliminar una rutina existente, para mantener mi plan actualizado. | Media |
| 7 | Como usuario, quiero ver el historial de sesiones pasadas de una rutina, para comparar mi evolución entrenamiento a entrenamiento. | Baja |

---

## 4. Criterios de aceptación (ejemplos, historias 1–3)

**Historia 1 — Registro e inicio de sesión**
- El usuario puede crear una cuenta con email y contraseña.
- El sistema valida que el email no esté registrado previamente.
- El usuario puede iniciar sesión y recibe un token JWT válido.
- Las rutas protegidas rechazan peticiones sin token válido.

**Historia 2 — Crear rutina**
- El usuario puede dar un nombre a la rutina.
- El usuario puede añadir uno o más ejercicios, cada uno con series y repeticiones objetivo.
- La rutina queda asociada al usuario que la crea (no visible por otros usuarios, aunque en el MVP solo hay uno).

**Historia 3 — Registrar sesión de entrenamiento**
- El usuario puede seleccionar una rutina existente para iniciar una sesión.
- Por cada ejercicio de la rutina, puede registrar series reales (peso y repeticiones realizados).
- La sesión queda guardada con fecha y asociada a la rutina origen.

---

## 5. Stack técnico (referencia)

- **Frontend:** React + TanStack Query
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL + Prisma
- **Autenticación:** JWT (fase futura: passkeys/WebAuthn)
- **Infraestructura futura:** Docker, Capacitor

---

## 6. Roadmap de versiones

- **v0.1** — MVP (alcance descrito arriba)
- **v0.2** — Superseries y registro de cardio
- **v0.3** — Autenticación con passkeys/WebAuthn
- **v0.4** — Dockerización / self-hosted
- **v0.5** — App móvil con Capacitor
