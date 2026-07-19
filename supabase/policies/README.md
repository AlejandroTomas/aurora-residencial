# Policies (referencia)

Documentación humana de las políticas RLS vigentes. **La fuente de verdad es siempre
`supabase/migrations/009_rls.sql`** (y las migraciones posteriores que la modifiquen); esta
carpeta es solo para lectura rápida sin abrir la migración completa.

| Tabla                    | SELECT                                   | INSERT                | UPDATE                 | DELETE            |
| ------------------------- | ----------------------------------------- | ---------------------- | ------------------------ | ------------------ |
| `tenants`                 | mismo tenant                              | —                       | mismo tenant + admin      | —                   |
| `tenant_settings`         | mismo tenant                              | —                       | mismo tenant + admin      | —                   |
| `profiles`                | propio perfil o admin del tenant          | —                       | propio perfil o admin     | —                   |
| `stages`/`streets`/`blocks`/`lots` | mismo tenant                     | admin                  | admin                     | —                   |
| `residents`                | mismo tenant                              | admin                   | admin                     | —                   |
| `announcements`            | mismo tenant, publicados (o admin ve todo) | admin                | admin                     | —                   |
| `announcement_reads`       | admin ve todos; residente solo lo propio  | residente, solo lo propio | —                      | —                   |
| `documents`                 | mismo tenant                             | admin                   | admin                     | —                   |
| `announcement_documents`    | mismo tenant                             | admin                   | —                         | admin               |
| `audit_log`                 | admin del tenant                         | cualquier autenticado, su propio `user_id` | — | — (nunca se borra) |

Toda tabla sin policy para una operación queda bloqueada por defecto (nunca `using (true)`).
La granularidad de permisos por caso de uso (ej. "solo puede editar residentes de su propia
etapa") vive en `modules/*/permissions`, no en RLS — RLS aquí es la última línea de defensa
por tenant y rol.
