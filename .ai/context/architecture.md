# ==========================================

# MODULE ARCHITECTURE

# ==========================================

# Filosofía

Cada módulo representa un dominio del negocio.

Ejemplos

Residents

Announcements

Users

Settings

Notifications

Cada módulo es completamente independiente.

Un módulo nunca debe conocer la implementación interna de otro.

---

# Arquitectura

Toda operación sigue este flujo.

UI

↓

Server Action

↓

Service

↓

Repository

↓

Supabase

↓

PostgreSQL

Nunca saltar capas.

Incorrecto

UI

↓

Supabase

Correcto

UI

↓

Action

↓

Service

↓

Repository

---

# Responsabilidades

UI

Renderizar.

Mostrar datos.

Capturar eventos.

Nunca contener reglas de negocio.

---

Server Actions

Entrada del sistema.

Validar sesión.

Validar permisos.

Validar tenant.

Validar datos.

Llamar Services.

Revalidar caché.

Retornar respuesta.

No implementar reglas de negocio.

---

Services

Aquí vive el negocio.

Ejemplos

Un residente no puede existir dos veces.

No permitir más residentes que el plan contratado.

No permitir eliminar el último administrador.

Toda regla del negocio pertenece aquí.

---

Repositories

Solo acceso a datos.

Nunca lógica del negocio.

Nunca validaciones.

Nunca permisos.

Solo consultas.

---

Supabase

Solo persistencia.

No mover lógica de negocio al cliente.

---

# Estructura

modules/

    residents/

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

---

# Actions

Cada archivo ejecuta únicamente una acción.

Correcto

create-resident.action.ts

update-resident.action.ts

delete-resident.action.ts

archive-resident.action.ts

Incorrecto

resident.action.ts

---

# Services

Cada Service resuelve un caso de uso.

Correcto

CreateResidentService

UpdateResidentService

DeleteResidentService

ListResidentsService

Incorrecto

ResidentService

que contiene 50 métodos.

---

# Repository

El Repository únicamente conoce Supabase.

Nunca conoce React.

Nunca conoce Server Actions.

Nunca conoce componentes.

---

# Repositories

Correcto

ResidentRepository

AnnouncementRepository

UserRepository

---

# DTO

Toda información entre capas utiliza DTO.

Nunca enviar registros completos de PostgreSQL a la UI.

---

Ejemplo

ResidentDTO

id

fullName

email

phone

lot

block

street

status

No incluir columnas internas.

---

# Mappers

Toda transformación vive aquí.

Ejemplo

Database

↓

DTO

DTO

↓

Form

Form

↓

Database

Nunca transformar datos dentro de componentes.

---

# Validaciones

schemas/

Contiene únicamente Zod.

No colocar lógica adicional.

---

# Permissions

Cada módulo define permisos propios.

Ejemplo

Residents

Puede crear

Puede editar

Puede eliminar

Puede exportar

No mezclar permisos de otros módulos.

---

# Hooks

Los hooks contienen únicamente lógica reutilizable.

Nunca consultar Supabase directamente desde un hook.

---

# Utils

Solo helpers.

Nunca reglas del negocio.

---

# Constants

Toda constante reutilizable vive aquí.

Nunca repetir strings.

---

# Types

Tipos exclusivos del módulo.

Los tipos compartidos viven en core.

---

# Components

Los componentes solo renderizan.

Nunca llaman Repositories.

Nunca conocen PostgreSQL.

---

# Services

Los Services pueden utilizar múltiples Repositories.

Ejemplo

Crear residente.

↓

Consultar tenant.

↓

Consultar límite del plan.

↓

Consultar usuario.

↓

Crear residente.

↓

Crear auditoría.

Todo dentro del Service.

---

# Repository

Un Repository consulta una sola entidad.

Ejemplo

ResidentRepository

No consultar tablas ajenas salvo joins simples.

---

# Errores

Cada módulo define sus propios errores.

Ejemplo

ResidentAlreadyExistsError

ResidentNotFoundError

ResidentLimitExceededError

No lanzar Error genérico.

---

# Result Pattern

Los Services nunca regresan null.

Utilizar un patrón consistente.

Success

Failure

o lanzar errores tipados.

Nunca devolver valores ambiguos.

---

# Dependencias

Las dependencias siempre apuntan hacia abajo.

UI

↓

Actions

↓

Services

↓

Repositories

Nunca al revés.

---

# Comunicación entre módulos

Si Residents necesita información de Users,

No acceder directamente al Repository.

Consumir el Service público.

---

# Index

Todo módulo exporta únicamente su API pública.

Ejemplo

index.ts

Nunca importar archivos internos.

---

# README

Cada módulo contiene README.md

Debe documentar.

Objetivo

Flujo

Dependencias

Permisos

Casos de uso

---

# Casos de uso

Pensar siempre en casos de uso.

No en CRUD.

Ejemplo

Incorrecto

Editar residente

Correcto

Cambiar domicilio del residente

Registrar nuevo residente

Suspender residente

Reactivar residente

---

# Side Effects

Todo efecto secundario debe ser explícito.

Ejemplo

Crear residente

↓

Crear auditoría

↓

Enviar notificación

↓

Revalidar caché

Nunca ocultar efectos secundarios.

---

# Logs

Toda operación importante genera log.

Nunca utilizar console.log.

---

# Caché

El Service no conoce caché.

La Action decide cuándo revalidar.

---

# Eventos

Preparar la arquitectura para eventos futuros.

Ejemplo

ResidentCreated

ResidentDeleted

AnnouncementPublished

Aunque inicialmente no exista Event Bus.

---

# Reutilización

Si dos módulos comparten lógica,

Moverla a core.

Nunca duplicar código.

---

# Regla Final

Si mañana se cambia Supabase por otro proveedor, únicamente deberían modificarse los Repositories.

La UI, los Services y las Actions deben seguir funcionando prácticamente sin cambios.

# Una mejora que añadiría

Aquí es donde me separaría un poco de una arquitectura típica de Next.js.

Agregaría una carpeta policies dentro de cada módulo.

Por ejemplo:

modules/
└── residents/
├── actions/
├── services/
├── repositories/
├── policies/
│ ├── can-create-resident.ts
│ ├── can-update-resident.ts
│ ├── can-delete-resident.ts
│ └── can-view-resident.ts
└── ...
