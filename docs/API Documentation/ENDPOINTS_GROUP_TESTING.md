# Guía Básica de Testing - Endpoints Grupos

Base URL:
```
http://<host>:<port>/groups
```

---

## 1. Crear grupo
**POST** `/groups`
- Requiere cookie de autenticación con permisos de super admin
- Body JSON:
```json
{
  "name": "Nombre del grupo",
  "description": "Descripción del grupo",
  "img": "base64string"
}
```
- Respuesta: Grupo creado

---

## 2. Actualizar grupo
**PUT** `/groups`
- Requiere cookie de autenticación con permisos de admin de grupo
- Body JSON:
```json
{
  "gid": 1,
  "name": "Nuevo nombre",
  "description": "Nueva descripción",
  "img": "base64string"
}
```
- Respuesta: Grupo actualizado

---

## 3. Eliminar grupo
**DELETE** `/groups`
- Requiere cookie de autenticación con permisos de admin de grupo
- Body JSON:
```json
{
  "gid": 1
}
```
- Respuesta: Grupo eliminado

---

## 4. Obtener mis grupos
**GET** `/groups`
- Requiere cookie de autenticación
- Respuesta: Array de grupos a los que pertenece el usuario

---

## 5. Obtener permisos de grupo
**GET** `/groups/rol/:id`
- Requiere cookie de autenticación
- Parámetro: `id` (en la URL)
- Respuesta: Permisos del usuario en el grupo

---

## 6. Agregar usuario a grupo
**POST** `/groups/management`
- Requiere cookie de autenticación con permisos de admin de grupo
- Body JSON:
```json
{
  "id": 2,
  "gid": 1
}
```
- Respuesta: Usuario agregado al grupo

---

## 7. Eliminar usuario de grupo
**DELETE** `/groups/management`
- Requiere cookie de autenticación con permisos de admin de grupo
- Body JSON:
```json
{
  "deleteUserId": 2,
  "gid": 1
}
```
- Respuesta: Usuario eliminado del grupo

---

## 8. Cambiar rol de usuario en grupo
**PUT** `/groups/management`
- Requiere cookie de autenticación con permisos de admin de grupo
- Body JSON:
```json
{
  "userId": 2,
  "rolId": 3,
  "groupId": 1
}
```
- Respuesta: Rol actualizado

---

## 9. Obtener grupos gestionados
**GET** `/groups/management`
- Requiere cookie de autenticación con permisos de admin de grupo
- Respuesta: Array de grupos gestionados por el usuario

---

## 10. Obtener información de grupo
**GET** `/groups/management/:id`
- Requiere cookie de autenticación con permisos de admin de grupo
- Parámetro: `id` (en la URL)
- Respuesta: Información detallada del grupo

---

## 11. Obtener usuarios de grupo
**GET** `/groups/management/userlist/:id`
- Requiere cookie de autenticación con permisos de admin de grupo
- Parámetro: `id` (en la URL)
- Respuesta: Array de usuarios del grupo

---

## Notas para testing
- Usar header `Content-Type: application/json` en todos los POST/PUT/DELETE.
- Usar cookie `authArgenmap` para endpoints protegidos.
- Validar respuestas: 200 (OK), 201 (Creado), 400 (Error datos), 401 (No autenticado), 403 (Sin permisos), 404 (No encontrado), 500 (Error servidor).
