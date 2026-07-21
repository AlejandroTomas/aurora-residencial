# Prompt — Crear un formulario

Todos los formularios comparten la misma arquitectura: React Hook Form + Zod + Server Action.
Nunca `useState` para el formulario completo. Referencias:
`src/modules/residents/components/ResidentFormDialog.tsx` (crear/editar en diálogo) y
`src/modules/auth/components/LoginForm.tsx` (formulario simple).

## Contexto que debe leerse primero

- `.ai/context/ui-guidelines.md` (Formularios, Inputs, Botones, Dialogs)
- El schema y la action del módulo destino

## Prompt

> Crea el componente **`{{Nombre}}Form`** (o `{{Nombre}}FormDialog`) en
> `src/modules/{{nombre_modulo}}/components/`.
>
> - `"use client";`. Usa `useForm<{{Input}}>({ resolver: zodResolver({{schema}}), defaultValues })`.
> - Cada campo: `Label` + `Input`/`select` (catálogos con `<select>` o `ui/select`, nunca texto
>   libre) + mensaje de error (`errors.campo.message`) + `aria-invalid`.
> - Envío: llama a la Server Action; si `!result.success` → `toast.error(result.error)`; si ok →
>   `toast.success(...)`, `router.refresh()` y (si es alta) `reset()`. Cierra el diálogo si aplica.
> - Botón submit: `disabled={isSubmitting}` con spinner (`Loader2 animate-spin`). Nunca permitir
>   doble envío durante la mutación.
> - Si es diálogo: `Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle`/`DialogFooter` con
>   Cancelar + Guardar; un solo componente reutilizado para crear (sin `{{entidad}}`) y editar
>   (con `{{entidad}}` en props).
> - Accesible (label por input, foco gestionado por el diálogo) y responsive (grid en pantallas grandes).
>
> No metas reglas de negocio ni acceso a datos aquí: el componente solo captura y delega en la Action.

## Recordatorios

- La validación de Zod se repite en el servidor (la Action revalida). El cliente valida por UX, no por seguridad.
- Exporta el componente desde `components/index.ts` y, si es parte de la API pública, desde `index.ts`.
