# ==========================================

# NEXT.JS & REACT STANDARDS

# ==========================================

## Filosofía

Next.js es un framework Server First.

Siempre asumir que un componente debe ser un Server Component.

Nunca convertir un componente en Client Component sin una razón técnica.

La directiva:

"use client"

debe considerarse una excepción.

No una regla.

---

## Server Components

Preferir Server Components para:

- páginas
- layouts
- dashboards
- tablas
- cards
- listas
- consultas
- reportes

Todo componente que únicamente renderiza información debe permanecer como Server Component.

---

## Client Components

Crear Client Components únicamente cuando exista:

- useState
- useEffect
- useReducer
- Context
- eventos del navegador
- drag & drop
- formularios interactivos
- animaciones
- APIs del navegador

Nunca agregar "use client" solo por comodidad.

---

## Regla importante

Si únicamente un botón necesita interacción:

Incorrecto

Toda la página es Client Component.

Correcto

La página permanece Server Component.

Solo el botón será Client Component.

---

# Data Fetching

Siempre intentar este orden.

1.

Server Component

↓

2.

Server Action

↓

3.

TanStack Query

↓

4.

API Route

Solo utilizar API Routes cuando sean estrictamente necesarias.

Ejemplos

- Webhooks
- Integraciones externas
- Servicios de terceros
- Descarga de archivos
- APIs públicas

Nunca crear una API Route para reemplazar una Server Action.

---

# Server Actions

Toda mutación de datos utiliza Server Actions.

Ejemplos

Crear residente

Editar residente

Eliminar residente

Crear comunicado

Cambiar contraseña

Actualizar perfil

No utilizar fetch hacia API Routes para estas operaciones.

---

# Organización

Cada Action debe hacer únicamente una operación.

Correcto

createResidentAction()

Incorrecto

residentAction()

---

No crear archivos gigantes.

Correcto

create-resident.action.ts

update-resident.action.ts

delete-resident.action.ts

list-residents.action.ts

---

# Validaciones

Toda Server Action debe validar:

1.

Autenticación

2.

Tenant

3.

Permisos

4.

Datos (Zod)

5.

Operación

6.

Respuesta

Nunca ejecutar una mutación sin validar.

---

# Navegación

Utilizar App Router.

Nunca utilizar Pages Router.

---

# Routing

Utilizar Route Groups.

Ejemplo

(auth)

(dashboard)

(public)

Nunca crear rutas planas innecesarias.

---

# Layouts

Aprovechar Layouts anidados.

No duplicar Sidebars.

No duplicar Navbars.

No duplicar Providers.

---

# Loading

Toda página importante debe tener

loading.tsx

Utilizar Skeletons.

Nunca mostrar pantallas completamente vacías.

---

# Error

Toda sección importante debe tener

error.tsx

Mostrar mensajes amigables.

Nunca exponer errores internos.

---

# Not Found

Utilizar

not-found.tsx

para rutas inexistentes.

---

# Suspense

Utilizar Suspense cuando existan múltiples consultas independientes.

Nunca bloquear toda la página esperando una sola consulta lenta.

---

# Streaming

Aprovechar Streaming.

Mostrar contenido disponible inmediatamente.

No esperar todo el dashboard para renderizar.

---

# Cache

Pensar primero en cache.

No deshabilitar cache sin razón.

Utilizar correctamente:

force-cache

no-store

revalidate

revalidateTag

revalidatePath

---

# Revalidación

Después de modificar información:

Siempre revalidar únicamente la información afectada.

Incorrecto

revalidatePath("/")

Correcto

revalidatePath("/dashboard/residents")

o

revalidateTag("residents")

---

# Formularios

Todos los formularios utilizan:

React Hook Form

-

Zod

No utilizar useState para formularios completos.

---

# Validaciones

Nunca confiar únicamente en React Hook Form.

Siempre validar nuevamente en el servidor.

---

# Estados

Evitar estados innecesarios.

Incorrecto

const [fullName, setFullName]

const [email, setEmail]

const [phone, setPhone]

...

Correcto

React Hook Form administra el formulario.

---

# Context

No utilizar Context para datos del servidor.

Context únicamente para:

Tema

Usuario autenticado (si es necesario)

Sidebar

Idioma

Configuraciones visuales

No almacenar listas completas dentro del Context.

---

# useEffect

Evitar useEffect.

Siempre preguntarse:

¿Realmente necesito un efecto?

Muchos useEffect indican mala arquitectura.

---

# Custom Hooks

Todo hook debe tener una responsabilidad.

Correcto

useResident()

useResidents()

useAnnouncement()

Incorrecto

useEverything()

---

# Hooks Compartidos

hooks/

solo contiene hooks reutilizables.

Los hooks específicos viven dentro del módulo.

---

# Componentes

Un componente no debe conocer Supabase.

Un componente no debe consultar directamente la base de datos.

Los componentes reciben datos.

No los buscan.

---

# Props

Preferir props explícitas.

Incorrecto

data

Correcto

resident

announcement

user

---

# Props opcionales

Evitar props opcionales cuando cambien completamente el comportamiento del componente.

Preferir dos componentes separados.

---

# Children

Utilizar children únicamente cuando agreguen claridad.

No envolver componentes innecesariamente.

---

# Renderizado condicional

Preferir retornos tempranos.

Incorrecto

if...

else...

else...

else...

Correcto

if (...)

return ...

if (...)

return ...

return ...

---

# Map

Nunca usar index como key.

Siempre utilizar ids.

---

# Memo

No utilizar React.memo por defecto.

Solo cuando exista una mejora medible.

---

# useMemo

No optimizar prematuramente.

Utilizar únicamente cuando exista una razón.

---

# useCallback

Misma regla.

No usar por costumbre.

---

# Lazy Loading

Utilizar lazy loading para:

Gráficas

Editores

Mapas

Calendarios

No dividir componentes pequeños.

---

# Iconos

Utilizar Lucide.

No mezclar múltiples librerías de iconos.

---

# Fechas

Nunca utilizar Date directamente para mostrar fechas.

Crear utilidades compartidas.

Ejemplo

formatDate()

formatRelativeDate()

formatDateTime()

---

# Números

Crear helpers.

formatCurrency()

formatPercentage()

formatPhone()

formatFileSize()

---

# Strings

Nunca repetir textos.

Utilizar constantes cuando el texto sea reutilizable.

---

# Accesibilidad

Todo input debe tener label.

Todo botón debe tener texto o aria-label.

Todo diálogo debe poder cerrarse con ESC.

Todo modal debe manejar el foco correctamente.

Nunca sacrificar accesibilidad por diseño.

---

# Internacionalización

Diseñar componentes preparados para múltiples idiomas.

No concatenar textos.

Incorrecto

"Hola " + user.name

Preferir formatos parametrizados.

---

# Performance

Optimizar únicamente cuando exista evidencia.

Primero código limpio.

Después optimización.

Nunca al revés.

---

# Regla Final

El código debe parecer escrito por un único desarrollador senior.

Consistencia sobre preferencias personales.

# Una mejora que quiero hacer al proyecto

Hay algo que añadiría para que el sistema sea mucho más profesional desde el día uno: separar claramente los conceptos de autenticación, usuario, residente y persona.

En muchos sistemas estos conceptos se mezclan y luego es difícil evolucionarlos. Yo propondría un modelo como este:

auth.users (Supabase)
│
▼
profiles
│
▼
people
│
├── residents
├── administrators
└── guards
