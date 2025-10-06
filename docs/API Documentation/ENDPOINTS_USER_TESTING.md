# Guía Básica de Testing - Endpoints Usuarios

Base URL:
```
http://<host>:<port>/users
```

---

## 1. Obtener lista de usuarios
**GET** `/users`
- Requiere cookie de autenticación con permisos de administrador de grupo
- Respuesta: Array de usuarios
- Ejemplo de respuesta:
```json
[
  {
    "id": 1,
    "name": "Juan",
    "lastname": "Carlos",
    "email": "juan@ejemplo.com"
  },
  ...
]
```

---

## 2. Actualizar datos de usuario
**POST** `/users/update`
- Requiere cookie de autenticación
- Body JSON:
```json
{
  "name": "NuevoNombre",
  "lastname": "NuevoApellido",
  "password": "nuevacontraseña123"
}
```
- Notas:
  - El campo `password` es opcional, pero si se envía debe tener al menos 10 caracteres.
  - Solo actualiza el usuario autenticado (no otros usuarios).
- Respuesta: Datos actualizados del usuario
- Ejemplo de respuesta:
```json
{
  "id": 1,
  "name": "NuevoNombre",
  "lastname": "NuevoApellido",
  "email": "juan@ejemplo.com"
}
```

---

## Notas para testing
- Usar header `Content-Type: application/json` en todos los POST.
- Usar cookie `authArgenmap` para endpoints protegidos.
- Validar respuestas: 200 (OK), 400 (Error datos), 401 (No autenticado), 403 (Sin permisos), 404 (No encontrado), 500 (Error servidor).
- Si la contraseña es demasiado corta, debe devolver error 400.
- Si el token no es válido, debe devolver error 401.
