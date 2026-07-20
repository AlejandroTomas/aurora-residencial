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

---

# SaaS Architecture

Este proyecto es una plataforma SaaS Multi-Tenant.

Existe una única aplicación para todos los clientes.

Cada fraccionamiento representa un Tenant independiente.

Toda la información debe estar completamente aislada entre tenants mediante:

- Supabase Auth
- Server Actions
- Services
- Repositories
- Row Level Security (RLS)

Nunca confiar en el frontend para aislar información.

Toda consulta debe obtener automáticamente el tenant desde la sesión autenticada.

Nunca utilizar tenant_id enviado por el cliente.

---

# Platform Hierarchy

La plataforma tiene dos niveles claramente separados.

## 1. Platform

Administrada únicamente por el propietario del SaaS.

Puede administrar:

- Tenants
- Suscripciones
- Planes
- Facturación (futuro)
- Configuración global
- Feature Flags
- Analytics
- Soporte

Este nivel nunca administra residentes directamente.

---

## 2. Tenant

Cada Tenant representa un fraccionamiento.

Cada Tenant administra únicamente su propia información.

Ejemplo:

- Residentes
- Comunicados
- Eventos
- Vehículos
- Documentos
- Amenidades
- Visitas
- Incidencias

Un Tenant jamás puede consultar información de otro Tenant.

---

# Tenant Provisioning

Cuando un nuevo cliente contrata el sistema, la plataforma debe permitir crear automáticamente un nuevo Tenant.

El proceso de alta debe crear:

1. Tenant
2. Perfil del Administrador Principal
3. Organización inicial
4. Configuración básica
5. Roles por defecto
6. Permisos iniciales

El sistema debe dejar listo el fraccionamiento para comenzar a utilizarse inmediatamente.

---

# Tenant Onboarding

Cada Tenant debe contar con una pantalla de configuración inicial donde pueda registrar:

- Nombre del fraccionamiento
- Logotipo
- Dirección
- Estado
- Ciudad
- País
- Código Postal
- Teléfono
- Correo de contacto
- Sitio web (opcional)
- Zona horaria
- Idioma
- Moneda

Esta información pertenece al Tenant, no al usuario.

---

# Public Information

Cada Tenant debe generar automáticamente una URL pública única.

Ejemplos:

https://app.midominio.com/aurora-residencial

https://app.midominio.com/los-pinos

o mediante subdominios en el futuro:

https://aurora.midominio.com

La arquitectura debe estar preparada para soportar ambos esquemas sin cambios importantes.

---

# Platform Users

Existen dos tipos de usuarios.

Platform Users

- SUPER_ADMIN

Tenant Users

- ADMIN
- GUARD
- STAFF
- RESIDENT

Los permisos nunca deben mezclarse entre ambos niveles.

---

# Subscription Ready

Toda la arquitectura debe quedar preparada para soportar planes de suscripción.

Ejemplos:

- Básico
- Profesional
- Enterprise

Los límites del plan deben validarse desde los Services.

Ejemplos:

- Máximo de residentes
- Máximo de administradores
- Máximo de almacenamiento
- Máximo de comunicados
- Máximo de amenidades

Aunque el MVP no implemente pagos, la arquitectura debe estar preparada para ello.

---

# Resident Experience

La aplicación está dirigida a dos tipos principales de usuarios dentro de cada Tenant:

- Administradores
- Residentes

Los residentes también utilizan la plataforma, pero con permisos limitados.

Durante el MVP podrán:

- Registrarse
- Iniciar sesión
- Recuperar contraseña
- Completar su perfil
- Asociar su cuenta a una etapa, calle, manzana y lote
- Ver comunicados
- Marcar comunicados como leídos
- Editar su información personal

En futuras versiones podrán:

- Reservar amenidades
- Registrar visitantes
- Reportar incidencias
- Participar en votaciones
- Recibir notificaciones
- Consultar estados de cuenta

Los residentes nunca podrán administrar información del fraccionamiento.

---

# Resident Registration

El registro de residentes es autoservicio.

El flujo es el siguiente:

1. Crear una cuenta.
2. Verificar el correo electrónico.
3. Completar el perfil.
4. Seleccionar la etapa, calle, manzana y lote donde reside.
5. Enviar la solicitud de asociación.
6. Esperar la aprobación del administrador.

Una cuenta nunca debe quedar asociada automáticamente a un lote.

Toda solicitud debe ser revisada y aprobada por un administrador del Tenant.

El sistema debe permitir que un administrador apruebe o rechace la solicitud y deje un comentario interno si es necesario.

---

# Announcements Feed

Los comunicados representan el principal medio de comunicación entre el fraccionamiento y los residentes.

Los administradores son los únicos usuarios autorizados para crear, editar, publicar o eliminar comunicados.

Los residentes únicamente pueden consultar el contenido publicado.

La interfaz del feed debe inspirarse en aplicaciones modernas como Facebook o Instagram únicamente en términos de experiencia de usuario y presentación visual.

Esto significa:

- Publicaciones organizadas en tarjetas.
- Scroll vertical continuo.
- Imágenes destacadas.
- Archivos adjuntos.
- Fechas visibles.
- Autor del comunicado.
- Diseño limpio y fácil de consumir.
- Excelente experiencia en dispositivos móviles.

No implementar funcionalidades propias de una red social.

Los residentes no pueden:

- Crear publicaciones.
- Editar publicaciones.
- Eliminar publicaciones.
- Comentar.
- Reaccionar.
- Compartir contenido.

La arquitectura debe permitir agregar estas funcionalidades en el futuro si el producto lo requiere, pero el MVP no debe implementarlas.

---

# Tenant Structure

Cada Tenant administra su propia estructura física.

Como mínimo debe poder configurar:

- Etapas
- Calles
- Manzanas
- Lotes

Los residentes siempre estarán asociados a un lote.

Toda la información relacionada con un residente debe derivarse de esa asociación.

La estructura debe permitir crecer en el futuro para soportar:

- Casas
- Departamentos
- Torres
- Edificios
- Condominios
- Locales comerciales

Sin modificar la arquitectura principal.

---

# Future Ready

Toda nueva funcionalidad debe diseñarse pensando en la evolución del producto como plataforma SaaS.

Las decisiones técnicas deben facilitar la incorporación futura de módulos como:

- Amenidades
- Reservaciones
- Control de visitas
- Vehículos
- Incidencias
- Votaciones
- Encuestas
- Documentos
- Estados de cuenta
- Pagos
- Notificaciones Push
- Aplicación móvil

Nunca desarrollar funcionalidades que limiten el crecimiento futuro del sistema.
