# Módulo Membership

## Objetivo

Registro autoservicio de residentes y su aprobación por un administrador (CLAUDE.md →
Resident Registration). Una cuenta **nunca** queda asociada automáticamente a un lote:
primero se crea una solicitud y un admin la aprueba (creando el residente) o la rechaza.

## Flujo

1. El residente entra a la URL pública del fraccionamiento: `/registro/{slug}`.
2. Crea su cuenta (nombre, correo, contraseña), elige su lote y envía la solicitud.
3. La cuenta queda lista para iniciar sesión; su solicitud queda **PENDIENTE**.
4. Un administrador la revisa en `/solicitudes`: al **aprobar** se crea el residente ligado
   a la cuenta (`residents.profile_id`); al **rechazar** se guarda un comentario.
5. En su dashboard, el residente ve el estado (pendiente/rechazado) hasta ser admitido.

## Casos de uso

- `getRegistrationContext(slug)` — datos públicos del registro (nombre + lotes).
- `register(input)` — alta autoservicio (cuenta + perfil RESIDENT + solicitud). Público,
  vía service-role acotado al tenant del slug; compensa si algo falla.
- `listPendingRequests(session)` — solicitudes pendientes del tenant (admin).
- `approveRequest` / `rejectRequest(session, input)` — revisión (admin).
- `getMembershipStatus(session)` — estado del residente para su dashboard.

## API pública

- `index.ts` — actions, `RegisterForm`, `RequestsTable`, `RejectRequestDialog`,
  `MembershipStatusBanner`, tipos.
- `server.ts` — `getRegistrationContext`, `listPendingRequests`, `getMembershipStatus`.

## Permisos

`permissions/membership.permissions.ts` → `canReviewRequests` (admin). RLS de
`membership_requests`: el residente ve/crea lo suyo; el admin ve todo y actualiza.

## Decisiones / pendiente

- **Sin verificación por correo (por ahora):** la cuenta se crea con `email_confirm: true`
  (el residente entra de inmediato). Para exigir verificación, cambiar `createAuthUser`
  (service-role `createUser`) por el flujo `signUp` con `emailRedirectTo` al callback.
- **Selección de lote:** un único selector con la etiqueta completa (Etapa · Calle · Mz ·
  Lote), en vez de selects en cascada. Mismo resultado.
- [x] Notificación por correo al residente al aprobar/rechazar (vía `core/email` + Resend;
  tolerante si no hay `RESEND_API_KEY`).
