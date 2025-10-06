# Guía Básica de Testing - Endpoints Autenticación

Base URL:
```
http://<host>:<port>/auth
```

---

## 1. Registro de usuario
**POST** `/auth/register`
- Body JSON:
```json
{
  "email": "usuario@ejemplo.com",
  "name": "Juan",
  "lastname": "Carlos",
  "password": "miclave1234"
}
```
- Notas:
  - Todos los campos son obligatorios.
  - La contraseña debe tener al menos 10 caracteres.
  - Si el registro público está deshabilitado, devuelve error 400.
  - Si el email ya existe, devuelve error 400.
- Respuesta: Usuario registrado y cookie de autenticación
- Ejemplo de respuesta:
```json
{
  "id": 1,
  "email": "usuario@ejemplo.com",
  "name": "Juan",
  "lastname": "Carlos"
}
```

---

## 2. Login
**POST** `/auth/login`
- Body JSON:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "miclave1234"
}
```
- Respuesta: Usuario autenticado y cookie de autenticación
- Ejemplo de respuesta:
```json
{
  "id": 1,
  "email": "usuario@ejemplo.com",
  "name": "Juan",
  "lastname": "Carlos"
}
```

---

## 3. Verificar autenticación
**GET** `/auth/check`
- Requiere cookie de autenticación
- Respuesta: Estado de autenticación
- Ejemplo de respuesta:
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

---

## 4. Logout
**POST** `/auth/logout`
- Requiere cookie de autenticación
- Respuesta: 200 OK (sin body)

---

## Notas para testing
- Usar header `Content-Type: application/json` en todos los POST.
- Usar cookie `authArgenmap` para endpoints protegidos.
- Validar respuestas: 200 (OK), 201 (Creado), 400 (Error datos), 401 (No autenticado), 403 (Sin permisos), 404 (No encontrado), 500 (Error servidor).
- Si la contraseña es demasiado corta, debe devolver error 400.
- Si el email ya existe, debe devolver error 400.
- Si el registro público está deshabilitado, debe devolver error 400.
