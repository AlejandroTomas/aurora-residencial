# CLAUDE.md

# Fraccionamiento Manager

## Project Overview

Fraccionamiento Manager es un SaaS multi-tenant para la administración de fraccionamientos privados.

El objetivo principal es permitir que los administradores gestionen residentes, comunicados, documentos, eventos y futuras funcionalidades relacionadas con la administración residencial.

La aplicación debe ser extremadamente fácil de mantener, segura y escalable.

Este proyecto NO es un prototipo.

Todas las decisiones deben tomarse pensando en varios años de mantenimiento.

Siempre priorizar:

1. Seguridad
2. Legibilidad
3. Escalabilidad
4. Mantenibilidad
5. Performance
6. Experiencia del usuario

Nunca sacrificar arquitectura únicamente por escribir menos código.

---

# MVP

El MVP incluye únicamente:

- Login
- Recuperación de contraseña
- Dashboard
- Residentes
- Comunicados
- Perfil
- Configuración
- Roles
- Multi Tenant
- Storage de documentos
- Lectura de comunicados

NO agregar funcionalidades fuera del roadmap sin autorización.

---

# Tech Stack

Framework

- Next.js 16
- React 19
- TypeScript

Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

UI

- TailwindCSS
- shadcn/ui

Validaciones

- Zod

Forms

- React Hook Form

Data Fetching

- Server Components
- Server Actions

TanStack Query únicamente cuando realmente aporte valor.

NO usar TanStack Query para reemplazar Server Components.

---

# Arquitectura General

La aplicación utiliza una arquitectura modular basada en dominios.

Cada módulo representa una unidad de negocio independiente.

Ejemplos:

- Auth
- Residents
- Announcements
- Dashboard
- Notifications
- Settings

Cada módulo debe ser completamente autocontenido.

Nunca mezclar lógica entre módulos.

---

# Principios

Aplicar siempre:

- SOLID
- DRY
- KISS
- Clean Code
- Composition over Inheritance
- Explicit over Implicit

No escribir código "inteligente".

El código debe ser aburrido, claro y fácil de entender.

---

# Regla más importante

Todo el proyecto debe poder ser entendido por un desarrollador nuevo en menos de un día.

Si una solución complica la lectura del código, no utilizarla.

---

# Tipado

TypeScript STRICT obligatorio.

Está prohibido:

- any
- unknown sin validar
- ts-ignore
- ts-expect-error

Si una librería no está correctamente tipada, crear un wrapper.

---

# Convenciones

Variables

camelCase

Funciones

camelCase

Interfaces

PascalCase

Tipos

PascalCase

Enums

PascalCase

Componentes

PascalCase

Hooks

useNombre

Schemas

nombre.schema.ts

Actions

nombre.action.ts

Services

nombre.service.ts

Repositories

nombre.repository.ts

DTO

nombre.dto.ts

Mapper

nombre.mapper.ts

Constants

UPPER_SNAKE_CASE

---

# Estructura del Proyecto

src/

app/

components/

core/

modules/

providers/

hooks/

styles/

middleware.ts

types/

Nunca crear carpetas nuevas sin una justificación técnica.

---

# App

app únicamente contiene:

- pages
- layouts
- loading
- error
- not-found
- route handlers

Toda la lógica vive fuera de app.

---

# Components

Los componentes compartidos viven aquí.

Nunca colocar componentes de negocio aquí.

Los componentes específicos de negocio pertenecen a modules.

---

Componentes disponibles

components/

ui/

auth/

forms/

feedback/

layouts/

navigation/

theme/

compound/

charts/

logos/

icons/

typography/

shared/

---

# Modules

Toda funcionalidad del negocio vive dentro de modules.

Ejemplo

modules/

residents/

announcements/

auth/

dashboard/

profile/

notifications/

settings/

tenants/

users/

Cada módulo es independiente.

---

# Estructura de un módulo

actions/

components/

constants/

hooks/

mappers/

permissions/

repositories/

schemas/

services/

types/

utils/

validations/

index.ts

README.md

No eliminar carpetas aunque inicialmente estén vacías.

---

# Core

Core contiene únicamente código compartido.

Nunca colocar lógica específica del negocio.

core/

config/

constants/

env/

errors/

lib/

logger/

permissions/

services/

supabase/

types/

utils/

validations/

---

# Imports

Siempre utilizar alias.

Correcto

@/modules/residents

Incorrecto

../../../../components

---

# Barrel Exports

Cada carpeta pública debe tener un index.ts

Nunca importar archivos internos de otro módulo.

Siempre importar desde el index público.

---

# Longitud de archivos

Componentes

Máximo recomendado

250 líneas

Services

250 líneas

Hooks

200 líneas

Actions

150 líneas

Si un archivo crece demasiado dividir responsabilidades.

---

# Longitud de funciones

Máximo recomendado

40 líneas

Una función debe hacer únicamente una cosa.

---

# Comentarios

No comentar código obvio.

Incorrecto

// Incrementa el contador

counter++

Correcto

Explicar únicamente reglas de negocio complejas.

---

# Consoles

Prohibido dejar console.log.

Utilizar logger centralizado.

---

# Variables de entorno

Nunca acceder directamente a process.env.

Siempre utilizar:

core/env

Todas las variables deben validarse con Zod.

La aplicación no debe iniciar si falta una variable obligatoria.

---

# Manejo de errores

Nunca lanzar errores genéricos.

Incorrecto

throw new Error()

Correcto

throw new ResidentNotFoundError()

Crear errores personalizados.

---

# Seguridad

Nunca confiar en el frontend.

Toda validación crítica ocurre en el servidor.

Todas las mutaciones verifican:

- sesión
- tenant
- permisos
- datos

antes de ejecutarse.

---

# Multi Tenant

Todo pertenece a un tenant.

Todo.

Ejemplo

Resident

tenant_id

Announcement

tenant_id

Document

tenant_id

User

tenant_id

Nunca crear entidades sin tenant_id salvo tablas del sistema.

---

# Filosofía

Siempre pensar:

"¿Qué pasará cuando existan 500 fraccionamientos usando este sistema?"

La arquitectura debe soportarlo sin reescribirse.

# # Project Vision

Este proyecto no es una aplicación aislada.

Es el primer producto de una plataforma SaaS para administración de fraccionamientos.

Toda decisión técnica debe facilitar la incorporación futura de nuevos módulos como:

- Control de visitas
- Amenidades
- Reservaciones
- Incidencias
- Multas
- Pagos
- Encuestas
- Votaciones
- Caseta
- Integraciones con dispositivos
- Aplicación móvil

Se debe favorecer la extensibilidad sobre soluciones rápidas.

Cuando existan varias alternativas válidas, elegir aquella que facilite el crecimiento del producto sin introducir complejidad innecesaria.
