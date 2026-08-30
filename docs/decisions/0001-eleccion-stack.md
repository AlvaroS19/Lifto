# 0001 — Elección del stack técnico

**Estado:** Aceptado
**Fecha:** Agosto 2026

## Contexto

Lifto se desarrolla como proyecto de portfolio y aprendizaje práctico, inspirado en openGym. Había que decidir el stack completo antes de empezar el desarrollo.

## Decisión

- **Frontend: React** (en vez de Vue.js). Los proyectos previos del autor (FitQuest, Botiquín Digital) usan Vue.js; se elige React para diversificar el stack demostrado en el portfolio y por su mayor demanda actual en el mercado junior, asumiendo el coste de aprenderlo desde cero.
- **Gestión de estado: TanStack Query** desde el inicio (en vez de Context API). Aporta cache y refetching de datos del servidor listos para producción; se asume la curva de aprendizaje adicional desde la v0.1 para no tener que migrar más adelante.
- **Backend: Node.js + Express.** Ya usado en proyectos previos del autor; permite centrar el esfuerzo de aprendizaje en React sin arriesgar también el backend.
- **Base de datos: PostgreSQL + Prisma.** Mismo razonamiento — ya usado en Botiquín Digital, encaja con el modelo de datos relacional del proyecto.
- **Autenticación: JWT en el MVP, passkeys/WebAuthn en fase posterior (v0.3).** JWT permite avanzar rápido en el MVP; WebAuthn se aborda como fase de aprendizaje específica más adelante.

## Alternativas consideradas

- **Vue.js** para el frontend: descartado por no aportar diferenciación frente a los proyectos ya existentes del autor.
- **Context API** puro para estado: descartado para evitar una migración posterior a una librería de data fetching.

## Consecuencias

- El desarrollo del MVP será más lento de lo habitual al combinar dos tecnologías nuevas para el autor (React y TanStack Query) simultáneamente.
- El resultado final aporta más valor de portfolio al mostrar dominio de dos frameworks de frontend distintos (Vue y React).
