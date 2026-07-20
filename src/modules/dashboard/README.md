# Módulo Dashboard

## Objetivo

Resumen del fraccionamiento: métricas agregadas para la pantalla de inicio del admin.

## Casos de uso

- `getDashboardMetrics(session)` — totales de residentes, usuarios y comunicados.
  Consume la API pública de cada módulo (`listResidents`, `listUsers`, `listAnnouncements`),
  nunca sus repositorios (architecture.md: comunicación entre módulos vía Service público).

## API pública

- `server.ts` — `getDashboardMetrics` (server-only).
- `index.ts` — tipo `DashboardMetrics`.

No tiene mutaciones ni componentes propios: la pantalla la arma `app/(dashboard)/dashboard`.
