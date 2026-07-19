# ==========================================

# SUPABASE & DATABASE STANDARDS

# ==========================================

## Filosofía

Supabase es la única fuente de verdad.

No utilizar otra base de datos.

No duplicar información innecesariamente.

Siempre aprovechar las capacidades nativas de PostgreSQL antes de implementar lógica en TypeScript.

---

# Arquitectura

La aplicación utiliza:

- Supabase Auth
- PostgreSQL
- Row Level Security
- Supabase Storage
- Edge Functions (solo cuando sea necesario)
- Database Functions
- Database Triggers

No agregar servicios externos si Supabase ya ofrece una solución adecuada.

---

# Organización

Raíz del proyecto

supabase/

    migrations/

    seeds/

    functions/

    policies/

    storage/

    types/

    README.md

Nunca crear SQL fuera de esta carpeta.

Todo cambio de base de datos debe vivir en una migración.

---

# Base de Datos

Motor

PostgreSQL

UUID obligatorio.

Nunca utilizar enteros autoincrementales.

Correcto

id uuid primary key

Incorrecto

id serial

---

# Convenciones

Tablas

snake_case

Columnas

snake_case

Foreign Keys

nombre_tabla_id

Ejemplo

resident_id

tenant_id

announcement_id

created_by

updated_by

deleted_by

---

# Columnas Obligatorias

Toda tabla de negocio debe contener:

id

tenant_id

created_at

updated_at

created_by

updated_by

deleted_at

deleted_by

is_active

No crear excepciones.

---

# Soft Delete

Nunca eliminar información importante.

Utilizar:

deleted_at

deleted_by

is_active

Solo eliminar físicamente:

logs temporales

cache

tokens expirados

archivos temporales

---

# Multi Tenant

Todo pertenece a un tenant.

Siempre.

Ejemplo

resident

tenant_id

announcement

tenant_id

document

tenant_id

event

tenant_id

vehicle

tenant_id

Nunca permitir registros sin tenant.

---

# Tenant

Un tenant representa un fraccionamiento.

Toda la información debe estar aislada.

Un administrador jamás podrá consultar datos de otro tenant.

Aunque modifique manualmente una petición HTTP.

La seguridad depende del servidor.

Nunca del frontend.

---

# Usuarios

Nunca crear tabla de autenticación personalizada.

Utilizar:

auth.users

Toda información adicional vive en:

profiles

---

# Profiles

La tabla profiles contiene:

id

tenant_id

email

full_name

phone

role

avatar_url

is_active

created_at

updated_at

El id siempre referencia auth.users.id

---

# Roles

Definir mediante Enum.

ADMIN

RESIDENT

GUARD

SUPER_ADMIN

No utilizar strings libres.

---

# Permisos

Los permisos nunca dependen del frontend.

Siempre validar:

usuario

↓

rol

↓

tenant

↓

operación

↓

respuesta

---

# Row Level Security

RLS es obligatorio.

Todas las tablas deben tener:

RLS ENABLED

Sin excepciones.

---

# Policies

Cada tabla debe definir:

SELECT

INSERT

UPDATE

DELETE

Nunca utilizar

USING (true)

en tablas de negocio.

---

# SELECT

Los usuarios solo pueden consultar información perteneciente a su tenant.

---

# INSERT

Validar:

Tenant

Rol

Usuario autenticado

---

# UPDATE

Validar:

Tenant

Permisos

Propietario

---

# DELETE

Preferir Soft Delete.

---

# SQL

Toda lógica crítica debe vivir en PostgreSQL.

Ejemplos

Auditoría

Historial

Validaciones

Restricciones

Contadores

No mover lógica importante al frontend.

---

# Constraints

Utilizar siempre:

NOT NULL

CHECK

UNIQUE

FOREIGN KEY

No confiar únicamente en Zod.

---

# Índices

Crear índices para:

tenant_id

email

created_at

foreign keys

Nunca optimizar después.

Diseñar correctamente desde el inicio.

---

# Relaciones

Siempre utilizar Foreign Keys.

Nunca guardar ids "sueltos".

---

# Storage

Buckets privados.

Nunca públicos.

Las imágenes se consultan mediante Signed URLs.

No guardar URLs permanentes.

---

# Archivos

Tipos permitidos

PDF

PNG

JPG

WEBP

DOCX

XLSX

Validar:

tipo

tamaño

extensión

antes de subir.

---

# Storage Structure

tenant-id/

    announcements/

    profiles/

    documents/

    events/

Nunca mezclar archivos de diferentes tenants.

---

# Auditoría

Toda operación importante debe registrarse.

Ejemplos

Crear residente

Editar residente

Eliminar residente

Crear comunicado

Actualizar configuración

Inicio de sesión

Cambio de contraseña

---

# Audit Log

Toda auditoría incluye:

id

tenant_id

user_id

action

table_name

record_id

old_data

new_data

ip

user_agent

created_at

Nunca eliminar auditoría.

---

# Historial

Los cambios importantes deben conservar:

antes

después

usuario

fecha

---

# Migraciones

Nunca modificar una migración existente.

Siempre crear una nueva.

Ejemplo

001_initial.sql

002_profiles.sql

003_announcements.sql

004_rls.sql

005_storage.sql

---

# Seeds

Crear datos mínimos.

Administrador

Tenant demo

Usuarios demo

Residentes demo

Nunca insertar información de producción.

---

# Triggers

Utilizar triggers para:

updated_at

auditoría

historial

sincronización

Evitar lógica compleja.

---

# Functions

Las funciones SQL deben ser pequeñas.

Una responsabilidad.

Correcto

create_resident()

Incorrecto

resident_manager()

---

# RPC

Utilizar RPC únicamente cuando exista lógica compleja.

No convertir PostgreSQL en una API completa.

---

# Supabase Client

Separar clientes.

client.ts

browser.ts

server.ts

middleware.ts

service-role.ts

Nunca reutilizar un cliente para todos los casos.

---

# Service Role

La Service Role Key

Nunca

debe llegar al navegador.

Solo disponible:

Servidor

Edge Functions

Cron Jobs

---

# Variables

Nunca escribir:

process.env...

Utilizar:

core/env

Todas las variables deben validarse.

---

# Seguridad

Nunca confiar en:

IDs enviados por el frontend

tenant_id enviado por el usuario

role enviado por el usuario

created_by enviado por el usuario

Siempre obtener esos datos desde la sesión.

---

# UUID

Generar UUID desde PostgreSQL.

No desde React.

---

# Fechas

Toda fecha se guarda en UTC.

La conversión ocurre únicamente al mostrar información.

---

# Timezone

Nunca asumir timezone local.

Siempre trabajar en UTC.

---

# Errores

Nunca regresar mensajes internos de PostgreSQL al usuario.

Crear errores amigables.

---

# Transacciones

Toda operación que modifica múltiples tablas debe ejecutarse dentro de una transacción.

Nunca dejar información inconsistente.

---

# Backup

Diseñar la base pensando que un backup debe poder restaurarse completamente.

No depender de archivos externos.

---

# Regla Final

La seguridad vive en PostgreSQL.

No en React.

No en Next.js.

No en el frontend.

Si un usuario modifica manualmente una petición HTTP, la base de datos debe seguir protegiendo la información.

# ==========================================

# DATABASE DOMAIN MODEL

# ==========================================

# Filosofía

La base de datos representa el negocio.

No la interfaz.

Nunca diseñar tablas pensando en pantallas.

Diseñar pensando en entidades reales.

---

# Tenant

Representa un fraccionamiento.

Ejemplo

Fraccionamiento Los Olivos

Fraccionamiento Santa Fe

Fraccionamiento Bosques

Todo pertenece a un Tenant.

---

# Jerarquía

Tenant

↓

Stages

↓

Streets

↓

Blocks

↓

Lots

↓

Residents

Nunca guardar direcciones como texto.

Siempre utilizar relaciones.

---

# Stage

Representa una etapa.

Ejemplo

Primera Etapa

Segunda Etapa

Etapa Norte

Etapa Sur

---

# Street

Pertenece a una etapa.

Una calle puede existir en distintas etapas.

Nunca asumir nombres únicos.

---

# Block

Pertenece a una calle.

Ejemplo

Manzana A

Manzana B

Manzana C

---

# Lot

Pertenece a una manzana.

Debe ser único dentro de esa manzana.

No necesariamente dentro del fraccionamiento.

---

# Resident

No representa una cuenta.

Representa una persona que habita un lote.

Puede existir sin acceso al sistema.

---

# Profile

Representa un usuario autenticado.

Puede existir aunque todavía no sea residente.

---

# Relación

Profile

↓

Resident

Es opcional.

No todo usuario autenticado debe ser residente.

Ejemplo

Administrador.

Guardia.

Personal de mantenimiento.

---

# Residentes

Cada residente pertenece únicamente a un lote.

Nunca permitir múltiples lotes en el MVP.

En versiones futuras podrá existir copropiedad.

---

# Lotes

El lote contiene información física.

Número

Área

Observaciones

Estado

No almacenar información personal.

---

# Ocupación

El lote puede estar:

Disponible

Habitado

Rentado

En construcción

Suspendido

No utilizar texto libre.

---

# Vehículos

Crear entidad independiente.

No guardar JSON.

Un residente puede tener varios vehículos.

---

# Documentos

Entidad independiente.

Nunca almacenar archivos dentro de PostgreSQL.

Solo referencias al Storage.

---

# Comunicados

Entidad independiente.

No incrustar comentarios.

Preparar relaciones.

---

# Lecturas

Entidad intermedia.

Announcement

↓

Resident

↓

Read

Permite saber quién leyó.

Nunca guardar arrays.

---

# Eventos

Entidad independiente.

No mezclar con comunicados.

---

# Configuración

Cada Tenant posee configuración.

Ejemplo

Logo

Nombre

Teléfono

Correo

Color principal

Zona horaria

Idioma

No colocar configuración en múltiples tablas.

---

# Catálogos

Los catálogos poseen tablas propias.

Ejemplos

Roles

Tipos de comunicado

Estados

Tipos de documento

Nunca utilizar strings repetidos.

---

# Auditoría

No modificar registros históricos.

Crear historial.

---

# Historial

Guardar:

Antes

Después

Usuario

Fecha

Acción

---

# Estados

Preferir estados mediante enums.

No utilizar booleanos cuando existan más de dos posibilidades.

---

# Archivos

Una entidad.

Múltiples relaciones.

Ejemplo

Documento

↓

Comunicado

Documento

↓

Residente

Documento

↓

Evento

No duplicar archivos.

---

# Comentarios

Preparar estructura.

Aunque el MVP no los implemente.

---

# Notificaciones

Preparar entidad.

Debe permitir:

Push

Correo

SMS

Futuras integraciones.

---

# Favoritos

No crear hasta que exista necesidad.

---

# Estadísticas

Nunca almacenar estadísticas calculables.

Calcular.

Solo persistir cuando el costo sea alto.

---

# Dashboard

No crear tablas específicas.

Consultar información existente.

---

# Eliminaciones

Nunca romper relaciones.

Preferir Soft Delete.

---

# Integridad

Toda relación debe tener Foreign Key.

No permitir datos huérfanos.

---

# Restricciones

Utilizar:

CHECK

UNIQUE

NOT NULL

FK

Antes que validaciones en TypeScript.

---

# Índices

Pensar en consultas.

No únicamente en inserciones.

---

# Búsquedas

Preparar columnas para búsqueda.

No concatenar campos.

---

# Versionado

Nunca modificar estructura manualmente.

Siempre mediante migraciones.

---

# Preparación futura

El modelo debe soportar posteriormente:

Visitas

Amenidades

Reservaciones

Pagos

Multas

Incidencias

Encuestas

Votaciones

Caseta

Control de acceso

Sin romper relaciones existentes.

---

# Regla Final

Agregar una tabla nueva debe ser una excepción.

Antes de crear una nueva entidad preguntarse:

¿Realmente representa un concepto nuevo del negocio?

Si no, probablemente pertenezca a una entidad existente.
