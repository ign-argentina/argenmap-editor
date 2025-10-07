# API Testing Guide - Argenmap Editor

## Base Configuration
- **Base URL**: `http://<host>:<port>`
- **Content-Type**: `application/json`
- **Authentication**: Cookie `authArgenmap` (JWT)


## Authentication Endpoints (`/auth`)

### POST `/auth/register`
**Descripción**: Registro de nuevo usuario

**Request Body**:
```json
{
  "email": "usuario@ejemplo.com",
  "name": "Juan",
  "lastname": "Carlos", 
  "password": "miclave1234"
}
```

**Responses**:
- **201 Created**:
```json
{
  "id": 1,
  "email": "usuario@ejemplo.com",
  "name": "Juan",
  "lastname": "Carlos"
}
```
- **400 Bad Request**: `"El registro publico ha sido deshabilitado por la administracion"`
- **400 Bad Request**: `"El correo ya esta en uso"`
- **500 Internal Server Error**: `{ "error": "message" }`

**Notas**: Establece cookie de autenticación en caso de éxito.


### POST `/auth/login`
**Descripción**: Iniciar sesión

**Request Body**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "miclave1234"
}
```

**Responses**:
- **200 OK**:
```json
{
  "id": 1,
  "email": "usuario@ejemplo.com",
  "name": "Juan",
  "lastname": "Carlos"
}
```
- **400 Bad Request**: `"error message"`
- **500 Internal Server Error**: `{ "error": "message" }`

**Notas**: Establece cookie de autenticación en caso de éxito.


### GET `/auth/check`
**Descripción**: Verificar estado de autenticación
**Authentication**: Required

**Responses**:
- **200 OK**:
```json
{
  "isAuth": true,
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "name": "Juan",
    "lastname": "Carlos"
  }
}
```
- **401 Unauthorized**: `{ "isAuth": false }`
- **500 Internal Server Error**: `{ "error": "message" }`


### POST `/auth/logout`
**Descripción**: Cerrar sesión
**Authentication**: Required

**Responses**:
- **200 OK**: (void body)

**Notas**: Elimina cookie de autenticación.


## User Endpoints (`/users`)

### GET `/users`
**Descripción**: Obtener lista de usuarios
**Authentication**: Required (Group Admin)

**Responses**:
- **200 OK**:
```json
[
  {
    "id": 1,
    "name": "Juan",
    "lastname": "Carlos",
    "email": "juan@ejemplo.com"
  }
]
```
- **500 Internal Server Error**: `{ "error": "message" }`


### POST `/users/update`
**Descripción**: Actualizar datos del usuario autenticado
**Authentication**: Required

**Request Body**:
```json
{
  "name": "NuevoNombre",
  "lastname": "NuevoApellido",
  "password": "nuevacontraseña123"
}
```

**Responses**:
- **200 OK**:
```json
{
  "id": 1,
  "name": "NuevoNombre",
  "lastname": "NuevoApellido",
  "email": "juan@ejemplo.com"
}
```
- **400 Bad Request**: `"La contraseña debe tener al menos 10 caracteres"`
- **401 Unauthorized**: `"Permisos denegados"`
- **500 Internal Server Error**: `{ "error": "message" }`

**Notas**: Campo `password` es opcional, pero debe tener al menos 10 caracteres si se envía.


## Viewer Endpoints (`/visores`)

### GET `/visores/publics`
**Descripción**: Obtener visores públicos

**Responses**:
- **200 OK**:
```json
[
  {
    "id": 1,
    "name": "Visor Público",
    "description": "Descripción",
    "isPublic": true,
    "img": "base64string"
  }
]
```
- **500 Internal Server Error**: `{ "error": "message" }`


### GET `/visores/myvisors`
**Descripción**: Obtener visores del usuario autenticado
**Authentication**: Required

**Responses**:
- **200 OK**:
```json
[
  {
    "id": 1,
    "name": "Mi Visor",
    "description": "Descripción",
    "isPublic": false,
    "img": "base64string"
  }
]
```
- **500 Internal Server Error**: `{ "error": "message" }`


### POST `/visores`
**Descripción**: Crear nuevo visor
**Authentication**: Required

**Request Body**:
```json
{
  "groupid": 1,
  "name": "Visor Test",
  "description": "Descripción",
  "configJson": "{...}",
  "img": "base64string",
  "isPublic": false
}
```

**Responses**:
- **201 Created**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Visor Test",
    "description": "Descripción",
    "isPublic": false
  }
}
```
- **400 Bad Request**: `{ "error": "Faltan campos requeridos" }`
- **500 Internal Server Error**: `{ "error": "Error al guardar visor", "detail": "message" }`

**Notas**: Campos `name` y `configJson` son obligatorios.


### PUT `/visores`
**Descripción**: Actualizar visor existente
**Authentication**: Required

**Request Body**:
```json
{
  "visorid": 1,
  "visorgid": 1,
  "name": "Nuevo nombre",
  "description": "Nueva descripción",
  "configid": 2,
  "configjson": "{...}",
  "imageData": "base64string"
}
```

**Responses**:
- **200 OK**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nuevo nombre",
    "description": "Nueva descripción"
  }
}
```
- **400 Bad Request**: `{ "error": "Faltan campos requeridos" }`
- **500 Internal Server Error**: `{ "error": "message" }`


### DELETE `/visores`
**Descripción**: Eliminar visor
**Authentication**: Required

**Request Body**:
```json
{
  "visorid": 1,
  "visorgid": 1
}
```

**Responses**:
- **200 OK**:
```json
{
  "success": true
}
```
- **400 Bad Request**: `{ "error": "Falta el ID del visor" }`
- **403 Forbidden**: `{ "error": "message" }`
- **500 Internal Server Error**: `{ "error": "Error al eliminar el visor", "detail": "message" }`

**Notas**: `visorgid` es opcional. En caso de ser `undefined / null` aplicará lógica para borrar un visor personal.


### POST `/visores/share`
**Descripción**: Crear enlace compartido para visor

**Request Body**:
```json
{
  "visorid": 1,
  "visorgid": 1,
  "expires": 3600,
  "apiKey": "010203040506"
}
```
**Notas**: El atributo `apiKey` brindado es válido. Depende de su existencia el tipo de respuesta que se quiera obtener. 

**Responses**:
- **200 OK**:
```json
{
  "success": true,
  "shareToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **400 Bad Request**: `{ "error": "Falta el ID del visor" }`
- **403 Forbidden**: `{ "error": "message" }`
- **500 Internal Server Error**: `{ "error": "Error al crear sharelink", "detail": "message" }`

**Notas**: `apiKey` es para acceso desde workspace, `expires` es opcional (en segundos).


### GET `/visores/share`
**Descripción**: Obtener configuración por token compartido

**Query Parameters**:
- `shareToken` (required): Token de compartir
- `isTemporal` (optional): true/false
- `apikey` (optional): API key para acceso workspace

**Responses**:
- **200 OK**:
```json
{
  "data": "{...}",
  "preferences": "{...}"
}
```
- **403 Forbidden**: `{ "error": "message" }`
- **500 Internal Server Error**: `{ "error": "Error al buscar el visor", "detail": "message" }`


## Configuration Endpoints (`/configs`)

### POST `/configs`
**Descripción**: Crear nueva configuración

**Request Body**:
```json
{
  "json": {
    "data": "...",
    "preferences": "..."
  }
}
```

**Responses**:
- **201 Created**:
```json
{
  "id": 1,
  "json": "{...}",
  "created_at": "2025-10-07T..."
}
```
- **400 Bad Request**: `{ "error": "Falta el campo json" }`
- **500 Internal Server Error**: `{ "err": "message" }`


### PUT `/configs/:id`
**Descripción**: Actualizar configuración existente

**Path Parameters**:
- `id` (required): ID de la configuración

**Request Body**:
```json
{
  "json": {
    "data": "...",
    "preferences": "..."
  }
}
```

**Responses**:
- **200 OK**:
```json
{
  "id": 1,
  "json": "{...}",
  "updated_at": "2025-10-07T..."
}
```
- **400 Bad Request**: `{ "error": "Los campos ID y JSON son obligatorios" }`
- **404 Not Found**: `{ "error": "Error al actualizar config" }`
- **500 Internal Server Error**: `{ "err": "message" }`


### GET `/configs/:id`
**Descripción**: Obtener configuración por ID

**Path Parameters**:
- `id` (required): ID de la configuración

**Responses**:
- **200 OK**:
```json
{
  "id": 1,
  "json": "{...}",
  "created_at": "2025-10-07T...",
  "updated_at": "2025-10-07T..."
}
```
- **404 Not Found**: `{ "error": "message" }`
- **500 Internal Server Error**: `{ "error": "Error al obtener la configuración", "detail": "message" }`


## Group Endpoints (`/groups`)

### GET `/groups`
**Descripción**: Obtener grupos del usuario autenticado
**Authentication**: Required

**Responses**:
- **200 OK**:
```json
[
  {
    "id": 1,
    "name": "Grupo Test",
    "description": "Descripción"
  }
]
```
- **500 Internal Server Error**: `{ "error": "message" }`


### PUT `/groups`
**Descripción**: Actualizar grupo
**Authentication**: Required (Group Admin)

**Request Body**:
```json
{
  "gid": 1,
  "name": "Nuevo nombre",
  "description": "Nueva descripción",
  "img": "base64string"
}
```

**Responses**:
- **200 OK**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nuevo nombre",
    "description": "Nueva descripción"
  }
}
```
- **400 Bad Request**: `"error message"`
- **500 Internal Server Error**: `{ "error": "message" }`


### DELETE `/groups`
**Descripción**: Eliminar grupo
**Authentication**: Required (Group Admin)

**Request Body**:
```json
{
  "gid": 1
}
```

**Responses**:
- **200 OK**:
```json
{
  "success": true
}
```
- **403 Forbidden**: `"error message"`
- **500 Internal Server Error**: `{ "error": "message" }`


### POST `/groups/management`
**Descripción**: Agregar usuario a grupo
**Authentication**: Required (Group Admin)

**Request Body**:
```json
{
  "id": 2,
  "gid": 1
}
```

**Responses**:
- **200 OK**:
```json
{
  "success": true
}
```
- **400 Bad Request**: `{ "success": false, "error": "message" }`
- **500 Internal Server Error**: `{ "error": "message" }`


### GET `/groups/management/userlist/:id`
**Descripción**: Obtener usuarios de un grupo
**Authentication**: Required (Group Admin)

**Path Parameters**:
- `id` (required): ID del grupo

**Responses**:
- **200 OK**:
```json
[
  {
    "id": 1,
    "name": "Juan",
    "lastname": "Carlos",
    "email": "juan@ejemplo.com",
    "role": "admin"
  }
]
```
- **400 Bad Request**: `{ "success": false, "error": "message" }`
- **500 Internal Server Error**: `{ "error": "message" }`


## Common HTTP Status Codes

- **200 OK**: Solicitud exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: Sin autenticación o token inválido
- **403 Forbidden**: Sin permisos suficientes
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor


## Comentarios finales

- Usar cookie `authArgenmap` para autenticación. Para obtenerlo, una vez que te autentiques, podés extraer el valor de la cookie
  desde la consola del navegador.
- Validar todos los campos obligatorios antes de enviar.
- Las contraseñas deben tener al menos 10 caracteres.
- Solo endpoints específicos permiten acceso sin autenticación.
- Los permisos de administrador son requeridos para operaciones de gestión.