# ==========================================

# AI DEVELOPMENT WORKFLOW

# ==========================================

# Filosofía

Claude Code es un miembro más del equipo.

Debe escribir código como un desarrollador Senior.

Debe priorizar:

Seguridad

Legibilidad

Mantenibilidad

Consistencia

Escalabilidad

Nunca velocidad sobre calidad.

---

# Antes de escribir código

Siempre realizar este proceso mental.

1.

Entender el problema.

2.

Buscar código existente.

3.

Reutilizar componentes.

4.

Diseñar la solución.

5.

Escribir código.

6.

Refactorizar.

7.

Validar.

Nunca comenzar escribiendo código inmediatamente.

---

# Reutilización

Antes de crear cualquier archivo revisar:

components/

modules/

core/

hooks/

services/

Si ya existe una solución similar, reutilizarla.

---

# Cambios

Modificar la menor cantidad posible de archivos.

Evitar refactors innecesarios.

No cambiar código que no esté relacionado con la tarea.

---

# Consistencia

Todo código nuevo debe parecer escrito por el mismo desarrollador que escribió el resto del proyecto.

Nunca mezclar estilos.

---

# Nuevos Componentes

Solo crear nuevos componentes cuando:

La reutilización no sea posible.

El componente tenga una responsabilidad clara.

No exista uno similar.

---

# Refactor

Si durante una tarea detectas código duplicado:

Puedes proponer un refactor.

Pero nunca hacerlo sin explicar el motivo.

---

# Arquitectura

Nunca romper la arquitectura definida.

UI

↓

Action

↓

Service

↓

Repository

↓

Database

Nunca saltar capas.

---

# Responsabilidad

Cada archivo tiene una única responsabilidad.

Si un archivo comienza a resolver múltiples problemas:

Dividir.

---

# Imports

Siempre utilizar alias.

Nunca utilizar rutas relativas largas.

---

# Dependencias

Antes de instalar una dependencia preguntar:

¿Existe una solución nativa?

¿Next.js ya lo resuelve?

¿React ya lo resuelve?

¿Supabase ya lo resuelve?

Solo instalar cuando sea realmente necesario.

---

# Librerías

Preferir pocas dependencias.

Cada dependencia aumenta el costo de mantenimiento.

---

# Componentes

Nunca crear componentes gigantes.

Preferir composición.

---

# Props

Props explícitas.

No utilizar objetos ambiguos.

Incorrecto

data

item

Correcto

resident

announcement

profile

---

# Funciones

Una función.

Una responsabilidad.

---

# Nombres

Los nombres deben explicar el propósito.

Nunca utilizar:

temp

test

newData

value

item2

foo

bar

---

# Código

El código debe ser autoexplicativo.

Evitar comentarios innecesarios.

---

# Comentarios

Solo comentar:

Reglas del negocio.

Decisiones complejas.

Nunca comentar código evidente.

---

# Manejo de errores

Nunca ignorar errores.

Nunca utilizar catch vacío.

Siempre manejar el error.

---

# Logging

Registrar únicamente información útil.

Nunca registrar información sensible.

---

# TODO

No dejar TODO.

No dejar FIXME.

No dejar código incompleto.

---

# Dead Code

Eliminar código muerto.

No comentar bloques completos.

Git conserva el historial.

---

# Optimización

Primero claridad.

Después performance.

Nunca optimizar antes de medir.

---

# Accesibilidad

Todo componente nuevo debe cumplir accesibilidad.

Labels

Focus

Keyboard

ARIA

---

# Responsive

Todo componente nuevo debe funcionar correctamente.

Desktop

Tablet

Mobile

---

# Estados

Todo componente debe contemplar:

Loading

Error

Empty

Success

Disabled

---

# Formularios

Todos los formularios siguen exactamente la misma arquitectura.

No inventar estructuras nuevas.

---

# Server Actions

Toda mutación utiliza Server Actions.

No utilizar API Routes sin justificación.

---

# Seguridad

Toda mutación valida:

Sesión

Tenant

Rol

Permisos

Datos

Nunca confiar en el cliente.

---

# RLS

Asumir siempre que RLS protege la información.

Nunca intentar reemplazar RLS desde React.

---

# TypeScript

Está prohibido:

any

ts-ignore

ts-expect-error

Si una librería no tiene tipos:

Crear tipos.

---

# Testing Mental

Antes de finalizar pensar.

¿Qué ocurre si?

No existe conexión.

No existe sesión.

No existe permiso.

El registro no existe.

El usuario modifica la petición.

Dos usuarios ejecutan la acción al mismo tiempo.

---

# Checklist

Antes de entregar una tarea verificar.

Compila.

Sin errores TypeScript.

Sin errores ESLint.

Sin warnings importantes.

Sin any.

Sin código duplicado.

Sin console.log.

Permisos correctos.

RLS respetado.

Responsive.

Accesible.

Imports limpios.

---

# Respuestas

Cuando termines una tarea incluye un resumen.

Qué cambió.

Qué archivos fueron modificados.

Por qué.

Qué decisiones técnicas fueron tomadas.

Posibles mejoras futuras.

---

# Si existe ambigüedad

Nunca asumir.

Explicar opciones.

Elegir la más simple.

Justificar la decisión.

---

# Si existe conflicto

Priorizar este orden.

Seguridad

↓

Integridad

↓

Arquitectura

↓

Consistencia

↓

Performance

↓

Preferencias personales

---

# Si existe deuda técnica

No ocultarla.

Documentarla.

Proponer solución.

---

# Definition of Done

Una tarea solo está terminada cuando:

Funciona.

Es segura.

Es mantenible.

Respeta la arquitectura.

Respeta el CLAUDE.md.

No rompe funcionalidades existentes.

No introduce deuda técnica.

---

# Principio Final

Todo el código escrito hoy debe seguir siendo entendible dentro de cinco años.

La simplicidad siempre vence a la complejidad.
