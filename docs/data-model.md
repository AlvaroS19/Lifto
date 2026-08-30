# Modelo de datos — Lifto

**Versión:** 1.0
**Fecha:** Agosto 2026

## Entidades

### User
| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| email | string | único |
| password_hash | string | |
| created_at | datetime | |

### Exercise
| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| name | string | |
| muscle_group | string | |
| equipment | string | opcional |
| video_url | string | opcional — fuente pendiente de definir |
| created_by | UUID (FK → User) | nullable, para diferenciar catálogo base de ejercicios propios del usuario |

### Routine
| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| user_id | UUID (FK → User) | |
| name | string | |
| created_at | datetime | |

### RoutineExercise
Tabla intermedia entre `Routine` y `Exercise`.

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| routine_id | UUID (FK → Routine) | |
| exercise_id | UUID (FK → Exercise) | |
| order | int | orden dentro de la rutina |
| target_sets | int | |
| target_reps | int | |
| target_weight | float | opcional |
| superset_group_id | UUID | nullable — agrupa ejercicios en la misma superserie (uso desde v0.2) |
| progression_scheme | enum | nullable — `LINEAR`, `GREYSKULL`, `DOUBLE_PROGRESSION`, `TIME_BASED` (uso desde v0.2) |

### WorkoutSession
| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| user_id | UUID (FK → User) | |
| routine_id | UUID (FK → Routine) | |
| date | datetime | |
| notes | string | opcional |

### SessionSet
Lo que realmente ocurrió en una sesión, separado de los objetivos definidos en `RoutineExercise`.

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| session_id | UUID (FK → WorkoutSession) | |
| routine_exercise_id | UUID (FK → RoutineExercise) | |
| set_number | int | |
| reps | int | |
| weight | float | |
| is_dropset | boolean | default false — uso desde v0.2 |
| is_restpause | boolean | default false — uso desde v0.2 |

### BodyWeightLog
| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| user_id | UUID (FK → User) | |
| weight | float | |
| date | datetime | |

## Relaciones clave

- Un `User` tiene muchas `Routine` y muchos `BodyWeightLog`.
- Una `Routine` tiene muchos `RoutineExercise` (permite reordenar y, en el futuro, agrupar por superserie vía `superset_group_id`).
- Una `WorkoutSession` referencia una `Routine`, pero registra en `SessionSet` lo que realmente ocurrió — separado de los objetivos (`target_*`) definidos en `RoutineExercise`, para poder comparar objetivo vs. realidad.

## Decisiones de diseño

- **`superset_group_id` y `progression_scheme` ya en el MVP:** aunque las superseries y la progresión automática son funcionalidad de v0.2, se incluyen los campos desde el inicio (nullable) para evitar migraciones estructurales grandes más adelante — solo se activa su uso cuando llegue esa fase.
