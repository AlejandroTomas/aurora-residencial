# ==========================================

# UI ARCHITECTURE & COMPONENT STANDARDS

# ==========================================

# Filosofía

La interfaz debe ser consistente.

No diseñar cada pantalla desde cero.

Todo debe reutilizar componentes existentes.

Antes de crear un nuevo componente preguntar:

¿Ya existe uno similar?

¿Puede extenderse?

¿Puede componerse?

Solo crear uno nuevo si la respuesta es NO.

---

# Diseño

Toda la aplicación sigue un Design System.

Nunca utilizar estilos inline.

Nunca utilizar CSS Modules.

Toda la UI utiliza:

TailwindCSS

-

shadcn/ui

---

# Componentes

Existen dos tipos.

Shared Components

Componentes reutilizables.

Ejemplos

Button

Card

PageHeader

DataTable

EmptyState

Loading

Feature Components

Viven dentro del módulo.

Ejemplo

ResidentCard

ResidentForm

ResidentTable

AnnouncementEditor

---

# Regla

Un componente compartido jamás debe importar un módulo.

Correcto

components/forms

Incorrecto

components importa modules/residents

---

# Tamaño

Componentes

Máximo recomendado

250 líneas

Layouts

300 líneas

Formularios

300 líneas

Si crecen demasiado dividir.

---

# Props

Siempre tipadas.

Nunca utilizar

any

Nunca utilizar

Record<string, any>

---

# Componentes Presentacionales

No conocen:

Supabase

Server Actions

Base de datos

Fetch

Solo reciben datos.

---

# Componentes Contenedores

Obtienen información.

Preparan datos.

Llaman Actions.

Renderizan componentes.

---

# Formularios

Todos utilizan

React Hook Form

-

Zod

No crear formularios con useState.

---

# Form Provider

Todos los formularios deben compartir la misma arquitectura.

Ejemplo

Form

↓

FormField

↓

FormItem

↓

FormControl

↓

Input

---

# Validaciones

Frontend

↓

Backend

↓

Base de datos

Las tres capas validan.

---

# Inputs

Todo Input debe tener

Label

Descripción opcional

Mensaje de error

Estado disabled

Estado loading

Placeholder cuando sea necesario

---

# Select

Nunca utilizar texto libre cuando exista un catálogo.

Ejemplo

Etapa

Rol

Estado

Tipo de comunicado

Siempre utilizar Select.

---

# Botones

Todos siguen el mismo comportamiento.

Loading

Disabled

Spinner

Accesibilidad

Nunca permitir doble click durante una mutación.

---

# Loading

Nunca bloquear completamente la aplicación.

Utilizar:

Skeleton

Spinner

Progress

según corresponda.

---

# Skeleton

Preferir Skeleton.

Nunca mostrar espacios vacíos.

---

# Empty States

Toda lista debe definir un Empty State.

Debe contener:

Título

Descripción

Acción principal

Ilustración opcional

---

# Error States

Toda consulta importante debe mostrar:

Mensaje

Descripción

Botón Reintentar

Nunca mostrar errores técnicos.

---

# Toasts

Utilizar para:

Crear

Editar

Eliminar

Guardar

No utilizar para errores críticos.

---

# Dialogs

Todos los diálogos siguen la misma estructura.

Título

Descripción

Contenido

Footer

Cancelar

Aceptar

---

# Confirmaciones

Eliminar

Desactivar

Cerrar sesión

Cambios destructivos

Siempre requieren confirmación.

---

# Drawers

Utilizar Drawers cuando el usuario no deba abandonar el contexto.

Ejemplo

Editar residente

---

# Modals

Utilizar únicamente cuando el contexto sea corto.

No colocar formularios enormes dentro de un modal.

---

# Tablas

Toda tabla utiliza el mismo componente base.

Nunca crear tablas diferentes para cada módulo.

---

# DataTable

Debe soportar

Sorting

Searching

Pagination

Loading

Empty State

Selection

Responsive

Actions

---

# Columnas

Nunca colocar lógica compleja dentro de una columna.

Extraer componentes.

---

# Acciones

Las acciones de una fila siempre aparecen en el extremo derecho.

---

# Responsive

Las tablas deben degradar correctamente.

Desktop

↓

Tablet

↓

Mobile

Nunca ocultar información importante.

---

# Cards

Las Cards son reutilizables.

No colocar lógica dentro.

---

# Badges

Utilizar Badges para estados.

Nunca colores sueltos.

Ejemplo

Activo

Inactivo

Pendiente

Publicado

Archivado

---

# Avatars

Siempre mostrar iniciales cuando no exista imagen.

---

# Iconografía

Solo utilizar Lucide.

No mezclar Heroicons.

No mezclar FontAwesome.

---

# Tipografía

Mantener jerarquía consistente.

Page Title

Section Title

Card Title

Body

Caption

No inventar tamaños.

---

# Espaciado

Utilizar la escala de Tailwind.

Nunca márgenes arbitrarios.

---

# Colores

Todos los colores provienen del tema.

Nunca escribir:

text-red-600

bg-blue-500

salvo casos excepcionales.

Preferir tokens.

---

# Animaciones

Sutiles.

Rápidas.

Nunca distraer.

---

# Accesibilidad

Todo componente debe ser navegable con teclado.

Todo diálogo maneja foco.

Todo botón posee aria-label cuando sea necesario.

---

# Formularios Grandes

Dividir en secciones.

Nunca crear formularios de 30 campos seguidos.

---

# Wizards

Utilizar Steps cuando existan procesos largos.

---

# Breadcrumbs

Mostrar únicamente cuando agreguen contexto.

---

# Dashboard

Todo dashboard utiliza:

Cards

Charts

Tablas

Indicadores

No mezclar estilos.

---

# Layout

Todo módulo sigue:

PageHeader

↓

Actions

↓

Filters

↓

Content

↓

Pagination

---

# Búsquedas

Buscar mientras el usuario escribe.

Aplicar debounce.

---

# Filtros

Todos los filtros permanecen sincronizados con la URL.

Nunca perder filtros al recargar.

---

# Estados

Toda pantalla debe contemplar.

Loading

Success

Empty

Error

Unauthorized

Forbidden

Offline

---

# Offline

La interfaz debe informar cuando no exista conexión.

Nunca dejar al usuario sin contexto.

---

# Notificaciones

No saturar al usuario.

Solo mostrar información útil.

---

# Confirmación Visual

Toda operación exitosa debe tener retroalimentación.

Guardar

Editar

Eliminar

Subir archivo

---

# Archivos

Mostrar:

Nombre

Peso

Tipo

Fecha

Nunca solo el nombre.

---

# Imágenes

Lazy Loading.

Placeholder.

Fallback.

---

# Componentes

Siempre preferir composición.

Incorrecto

MegaComponent

Correcto

Header

Toolbar

Table

Footer

---

# Reutilización

Antes de crear un componente nuevo revisar:

components/

compound/

forms/

feedback/

navigation/

shared/

Solo crear uno nuevo cuando realmente aporte valor.

---

# Regla Final

La experiencia del usuario debe sentirse igual en cualquier módulo.

Si un usuario aprende a usar Residentes, debe saber utilizar Comunicados sin necesidad de volver a aprender la interfaz.
