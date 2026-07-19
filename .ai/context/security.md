# ==========================================

# SECURITY, QUALITY & OPERATIONS

# ==========================================

# Filosofía

La seguridad no es una característica.

Es un requisito.

Toda nueva funcionalidad debe diseñarse pensando primero en:

- Seguridad
- Integridad
- Auditoría
- Recuperación
- Observabilidad

Nunca agregar una funcionalidad sin considerar estos aspectos.

---

# Trust Model

Nunca confiar en:

- El navegador
- El cliente
- El usuario
- Los parámetros de la URL
- Los IDs enviados desde el frontend
- Los roles enviados desde el frontend
- El tenant enviado desde el frontend

Todo debe obtenerse desde la sesión autenticada.

---

# Defense in Depth

Toda operación debe protegerse en múltiples niveles.

UI

↓

Server Action

↓

Service

↓

Repository

↓

Row Level Security

↓

Constraints

↓

PostgreSQL

Si una capa falla, la siguiente debe seguir protegiendo la información.

---

# Validaciones

Toda información recibida debe validarse.

Tipos

Longitud

Formato

Permisos

Tenant

Relaciones

Existencia

Nunca asumir que los datos son correctos.

---

# Sanitización

Eliminar espacios innecesarios.

Normalizar correos.

Normalizar teléfonos.

Eliminar caracteres invisibles.

Nunca almacenar datos inconsistentes.

---

# Rate Limiting

Aplicar límites para:

Login

Recuperación de contraseña

Invitaciones

Carga de archivos

Publicación de comunicados

Nunca permitir spam.

---

# Sesiones

Las sesiones deben expirar automáticamente.

Nunca almacenar información sensible en LocalStorage.

Nunca guardar JWT manualmente.

Utilizar únicamente Supabase Auth.

---

# Archivos

Validar siempre:

Tipo MIME

Extensión

Peso

Tamaño máximo

Nunca confiar en el nombre del archivo.

---

# Nombres de archivos

Nunca conservar el nombre original.

Generar nombres únicos.

Ejemplo

UUID.ext

---

# Storage

Toda descarga debe validarse nuevamente.

Nunca entregar archivos privados mediante URLs públicas.

---

# Secrets

Las claves nunca se escriben en el código.

Nunca subir:

.env

tokens

service_role

api_keys

certificados

al repositorio.

---

# Variables

Toda variable debe existir.

Si una variable obligatoria falta:

La aplicación no debe iniciar.

---

# Logs

Registrar únicamente información útil.

Nunca registrar:

Contraseñas

Tokens

Cookies

JWT

Claves privadas

Información bancaria

Datos sensibles

---

# Auditoría

Registrar:

Usuario

Acción

Entidad

Registro

Fecha

IP

User Agent

Resultado

Duración

Nunca eliminar auditoría.

---

# Observabilidad

Toda operación importante debe poder responder:

Quién

Qué

Cuándo

Dónde

Resultado

Tiempo

---

# Manejo de Errores

No mostrar mensajes internos.

Incorrecto

PostgreSQL Error 23505

Correcto

Ya existe un residente con esa información.

---

# Error Types

Crear errores específicos.

ValidationError

PermissionDeniedError

TenantMismatchError

NotFoundError

ConflictError

StorageError

Nunca utilizar Error genérico.

---

# Logging

Utilizar niveles.

Debug

Info

Warn

Error

Fatal

No utilizar console.log.

---

# Monitoreo

Toda excepción inesperada debe registrarse.

Nunca ignorar errores silenciosamente.

---

# Recuperación

Si una operación falla:

No dejar datos inconsistentes.

Utilizar transacciones.

---

# Timeouts

Toda operación externa debe tener timeout.

Nunca esperar indefinidamente.

---

# Reintentos

Solo realizar reintentos cuando la operación sea segura.

Nunca duplicar inserciones.

---

# Performance

Primero medir.

Después optimizar.

Nunca optimizar por intuición.

---

# Consultas

Seleccionar únicamente columnas necesarias.

Nunca utilizar:

SELECT \*

---

# Paginación

Toda lista debe paginarse.

Nunca cargar miles de registros.

---

# Búsquedas

Utilizar índices.

Nunca recorrer tablas completas innecesariamente.

---

# Caché

Revalidar únicamente los datos modificados.

Nunca invalidar toda la aplicación.

---

# Lazy Loading

Aplicar únicamente donde exista beneficio real.

---

# Accesibilidad

Toda funcionalidad debe ser usable con teclado.

Toda imagen requiere texto alternativo.

Toda acción importante debe ser accesible.

---

# Responsive

El sistema debe funcionar correctamente en:

Desktop

Tablet

Mobile

No crear versiones separadas.

---

# Internacionalización

Todo texto debe poder traducirse.

Evitar concatenaciones.

Evitar textos embebidos dentro del código.

---

# Mantenimiento

Eliminar código muerto.

Eliminar componentes sin uso.

Eliminar imports innecesarios.

Nunca dejar código comentado.

Utilizar Git para conservar historial.

---

# Dependencias

Antes de instalar una nueva dependencia preguntar:

¿Ya existe una solución en el proyecto?

¿Next.js ya lo resuelve?

¿Supabase ya lo resuelve?

¿Es realmente necesaria?

Minimizar dependencias.

---

# Actualizaciones

Mantener versiones recientes.

Evitar dependencias abandonadas.

---

# Definition of Done

Una tarea únicamente se considera terminada cuando:

Compila.

TypeScript sin errores.

ESLint limpio.

Sin warnings importantes.

Sin any.

Sin código duplicado.

Permisos validados.

RLS respetado.

Responsive.

Accesible.

Documentado.

Probado manualmente.

---

# Calidad

Priorizar siempre:

Legibilidad

Consistencia

Simplicidad

Seguridad

Sobre escribir menos líneas.

---

# Regla Final

Cada línea de código debe responder una pregunta:

¿Este código seguirá teniendo sentido dentro de tres años?

Si la respuesta es no, debe replantearse.
