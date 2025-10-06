# Guía Básica de Testing - Endpoints Visores

Base URL:
```
http://<host>:<port>/visores
```

---

## 1. Obtener visores públicos
**GET** `/visores/publics`
- Sin autenticación
- Respuesta: Array de visores públicos

---

## 2. Obtener todos los visores
**GET** `/visores`
- Sin autenticación
- Respuesta: Array de todos los visores

---

## 3. Obtener mis visores
**GET** `/visores/myvisors`
- Requiere cookie de autenticación
- Respuesta: Array de visores del usuario autenticado

---

## 4. Obtener visores de un grupo
**GET** `/visores/group/:groupid`
- Requiere cookie de autenticación
- Parámetro: `groupid` (en la URL)
- Respuesta: Array de visores del grupo

---

## 5. Crear visor
**POST** `/visores`
- Requiere cookie de autenticación
- Body JSON:
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
- Respuesta: Objeto visor creado

---

## 6. Actualizar visor
**PUT** `/visores`
- Requiere cookie de autenticación
- Body JSON:
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
- Respuesta: Objeto visor actualizado

---

## 7. Eliminar visor
**DELETE** `/visores`
- Requiere cookie de autenticación
- Body JSON:
```json
{
  "visorid": 1,
  "visorgid": 1
}
```
- Respuesta: `{ success: true }` o error

---

## 8. Obtener visor por ID
**GET** `/visores/:id`
- Parámetro: `id` (en la URL)
- Respuesta: Objeto visor

---

## 9. Compartir visor (crear link)
**POST** `/visores/share`
- Body JSON:
```json
{
  "visorid": 1,
  "visorgid": 1,
  "expires": 3600,
  "apiKey": "010203040506"
}
```
- Respuesta: `{ shareToken: "..." }`

---

## 10. Obtener configuración por token compartido
**GET** `/visores/share?shareToken=TOKEN`
- Parámetro: `shareToken` (query)
- Opcional: `isTemporal=true`, `apikey=...`
- Respuesta: Configuración del visor

---

## 11. Cambiar estado público
**POST** `/visores/publish`
- Requiere cookie de autenticación y permisos de admin grupo
- Body JSON:
```json
{
  "visorid": 1,
  "visorgid": 1
}
```
- Respuesta: `{ success: true }` o error

---

## 12. Cambiar estado compartido
**POST** `/visores/share/status`
- Requiere cookie de autenticación
- Body JSON:
```json
{
  "visorid": 1,
  "visorgid": 1
}
```
- Respuesta: `{ success: true }` o error

---

## 13. Restaurar visor eliminado de grupo
**PUT** `/visores/group/restoreviewer`
- Requiere cookie de autenticación y permisos de admin grupo. En caso de no agregar groupid, intentará en los visores personales.
- Body JSON:
```json
{
  "viewerid": 1,
  "groupid": 1
}
```
- Respuesta: `{ success: true }` o error

---

## 14. Obtener listado de visores eliminados de un grupo
**GET** `/visores/group/deleted/:groupid`
- Requiere cookie de autenticación y permisos de admin grupo
- Parámetro: `groupid` (Opcional, en la URL. En caso de no poner groupid, debería devolver los personales)
- Respuesta: Array de visores eliminados

---

## Notas para testing
- Usar header `Content-Type: application/json` en todos los POST/PUT/DELETE.
- Usar cookie `authArgenmap` para endpoints protegidos (Se puede obtener desde la consola del navegador).
- Validar respuestas: 200 (OK), 201 (Creado), 400 (Error datos), 401 (No autenticado), 403 (Sin permisos), 404 (No encontrado), 500 (Error servidor).
