# Guía Básica de Testing - Endpoints Configuraciones

Base URL:
```
http://<host>:<port>/configs
```

---

## 1. Crear configuración
**POST** `/configs`
- Body JSON:
```json
{
  "json": {
    "data": "...",
    "preferences": "..."
  }
}
```
- Notas:
  - El campo `json` es obligatorio.
- Respuesta: Configuración creada

---

## 2. Actualizar configuración
**PUT** `/configs/:id`
- Parámetro: `id` (en la URL)
- Body JSON:
```json
{
  "json": {
    "data": "...",
    "preferences": "..."
  }
}
```
- Notas:
  - El campo `json` y el parámetro `id` son obligatorios.
  - Si el campo preferences está vacío (void / null), la api entiende que se trata de una configuración del visor Kharta
- Respuesta: Configuración actualizada

---

## 3. Obtener configuración por ID
**GET** `/configs/:id`
- Parámetro: `id` (en la URL)
- Respuesta: Configuración correspondiente

---

## Notas para testing
- Usar header `Content-Type: application/json` en todos los POST/PUT.
- Validar respuestas: 200 (OK), 201 (Creado), 400 (Error datos), 404 (No encontrado), 500 (Error servidor).
- Si falta el campo `json` o el parámetro `id`, debe devolver error 400.

---

**IMPORTANTE:**
- El endpoint `GET /configs` está deshabilitado/comentado en el backend y no debe ser testeado.
- Solo testear los endpoints activos: crear, actualizar y obtener por ID.