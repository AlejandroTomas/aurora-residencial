# Prompt — Crear un Service (caso de uso)

Un Service resuelve **un** caso de uso y contiene las reglas de negocio. Referencia:
`src/modules/residents/services/create-resident.service.ts`.

## Contexto que debe leerse primero

- `.ai/context/architecture.md` (sección Services)
- `src/core/services/audit.service.ts` (`recordAudit`)
- Los repositories y mappers del módulo destino

## Prompt

> Crea el Service **`{{nombreCaso}}`** en
> `src/modules/{{nombre_modulo}}/services/{{nombre-caso}}.service.ts`.
>
> - Primera línea: `import "server-only";`.
> - Firma: `export async function {{nombreCaso}}(session: AuthSession, input: {{Input}}): Promise<{{Dto}}>`
>   (o `Promise<void>` si no devuelve datos). El `session` trae `tenantId`/`userId`.
> - Aquí viven las **reglas de negocio**: {{reglas}} (ej. "no duplicar", "no dejar sin último
>   admin", "validar que el lote pertenece al tenant"). Cada regla que falle lanza un error
>   tipado del módulo (`errors/`), nunca `throw new Error()`.
> - Orquesta uno o varios repositories; nunca toca Supabase directamente.
> - Tras una escritura, registra auditoría con `recordAudit({ tenantId, userId, action, tableName, recordId, oldData?, newData? })`.
> - Devuelve un DTO vía el mapper; nunca una fila cruda ni `null` ambiguo.
> - Exporta el Service desde `services/index.ts`.
>
> No pongas aquí: validación de permisos ni de Zod (eso es de la Action), ni acceso directo a
> la base (eso es del Repository).

## Salida esperada

- Archivo del Service + export en `services/index.ts`.
- Si el caso es de lectura pública para otros módulos/páginas, expón el Service en `server.ts`.
