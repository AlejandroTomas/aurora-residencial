# Checklist — Code Review

Qué verificar al revisar un cambio antes de aprobarlo. Prioridad ante conflicto:
**Seguridad → Integridad → Arquitectura → Consistencia → Performance → Preferencias**.

## Arquitectura

- [ ] Respeta el flujo por capas UI → Action → Service → Repository → Supabase. No se saltan capas (ej. un componente que llama a Supabase).
- [ ] La lógica de negocio vive en el Service, no en la Action ni en el componente.
- [ ] El Repository solo accede a datos: sin validaciones, permisos ni reglas.
- [ ] Nada importa archivos internos de otro módulo: solo su `index.ts`/`server.ts`.
- [ ] Frontera cliente/servidor correcta: lo `server-only` no puede llegar al bundle del cliente (va en `server.ts`).
- [ ] Cada archivo tiene una sola responsabilidad; funciones cortas (< ~40 líneas) y archivos dentro de los límites.

## Seguridad y multi-tenant

- [ ] Toda mutación valida sesión → permiso → tenant → datos, en el Service/Action.
- [ ] `tenant_id` y rol se obtienen de la sesión del servidor, nunca del cliente ni de la URL.
- [ ] Existe policy de RLS para la operación; no hay `using (true)`.
- [ ] Uso de service-role justificado y acotado (nunca en cliente; scoping por tenant explícito).
- [ ] Escrituras auditadas (`recordAudit`). No se registran datos sensibles en logs.
- [ ] Errores tipados (`AppError`); la UI recibe mensajes amigables vía `toActionError`, nunca el error interno.

## Tipado y calidad

- [ ] Sin `any`, `unknown` sin validar, `ts-ignore`, `ts-expect-error`.
- [ ] DTOs en las fronteras; no se filtran filas crudas de la base a la UI.
- [ ] `SELECT` de columnas explícitas; selects anidados tipados con `.returns<T>()`.
- [ ] Sin `console.log` (usar `logger`), sin código muerto, sin TODO/FIXME, sin `catch` vacío.
- [ ] Imports con alias `@/…`, nunca rutas relativas largas.

## UI / UX

- [ ] Server Component por defecto; `"use client"` justificado.
- [ ] Formularios con RHF + Zod; validación también en servidor.
- [ ] Estados cubiertos: loading, empty, error, success, disabled.
- [ ] Catálogos con `Select`; estados con `Badge`; iconos solo Lucide; colores del tema.
- [ ] Accesibilidad (labels, foco, teclado) y responsive (desktop/tablet/mobile).
- [ ] Consistencia: se siente igual que el resto de módulos; reutiliza componentes existentes.

## Testing mental

- [ ] ¿Qué pasa sin sesión, sin permiso, sin conexión?
- [ ] ¿Y si el registro no existe o pertenece a otro tenant?
- [ ] ¿Y si el cliente manipula el payload/IDs?
- [ ] ¿Y si dos usuarios ejecutan la acción a la vez (idempotencia, duplicados)?

## Cierre

- [ ] Cambios mínimos y relacionados con la tarea; sin refactors no explicados.
- [ ] `typecheck`, `build` y `eslint` verdes.
- [ ] Deuda técnica documentada en `.ai/control/alignment.md`.
