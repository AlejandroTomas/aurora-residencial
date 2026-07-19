# Types

Salida generada por el CLI de Supabase, no escrita a mano:

```
supabase gen types typescript --project-id <id> > supabase/types/database.types.ts
```

Hasta que exista un proyecto real y se genere ese archivo, `src/core/supabase/types.ts`
mantiene un placeholder mínimo. Cuando se genere `database.types.ts`, actualizar
`src/core/supabase/types.ts` para reexportarlo (o cambiar los imports de los clientes en
`src/core/supabase/*.ts` para apuntar aquí directamente).
