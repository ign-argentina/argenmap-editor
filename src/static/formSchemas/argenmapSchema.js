export const argenmapSchema = {
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "title": "Items",
      "items": {
        "oneOf": [
          {
            "title": "Basemap",
            "type": "object",
            "properties": {
              "type": { "const": "basemap", "title": "Tipo" },
              "peso": { "type": "number", "title": "Peso" },
              "nombre": { "type": "string", "title": "Nombre" },
              "short_abstract": { "type": "string", "title": "Resumen corto" },
              "class": { "type": "string", "title": "Clase CSS" },
              "seccion": { "type": "string", "title": "Sección" },
              "capas": {
                "type": "array",
                "title": "Capas",
                "items": {
                  "type": "object",
                  "properties": {
                    "titulo": { "type": "string", "title": "Título" },
                    "nombre": { "type": "string", "title": "Nombre" },
                    "servicio": { "type": "string", "title": "Servicio" },
                    "version": { "type": "string", "title": "Versión" },
                    "attribution": { "type": "string", "title": "Atribución" },
                    "host": { "type": "string", "title": "Host / URL" },
                    "legendImg": { "type": "string", "title": "Imagen de leyenda" },
                    "peso": { "type": "number", "title": "Peso" },
                    "selected": { "type": "boolean", "title": "Seleccionado" },
                    "zoom": {
                      "type": "object",
                      "title": "Zoom",
                      "properties": {
                        "min": { "type": "number", "title": "Zoom mínimo" },
                        "max": { "type": "number", "title": "Zoom máximo" },
                        "nativeMin": { "type": "number", "title": "Zoom nativo mínimo" },
                        "nativeMax": { "type": "number", "title": "Zoom nativo máximo" }
                      },
                      "required": ["min", "max", "nativeMin", "nativeMax"]
                    }
                  },
                  "required": ["titulo", "nombre", "servicio", "version", "host", "peso", "selected", "zoom"]
                }
              }
            },
            "required": ["type", "peso", "nombre", "capas", "seccion"]
          },
          {
            "title": "WMS Layer",
            "type": "object",
            "properties": {
              "type": { "const": "wmslayer", "title": "Tipo" },
              "peso": { "type": "number", "title": "Peso" },
              "nombre": { "type": "string", "title": "Nombre" },
              "short_abstract": { "type": "string", "title": "Resumen corto" },
              "class": { "type": "string", "title": "Clase CSS" },
              "seccion": { "type": "string", "title": "Sección" },
              "servicio": { "type": "string", "title": "Servicio" },
              "version": { "type": "string", "title": "Versión" },
              "host": { "type": "string", "title": "Host / URL" }
            },
            "required": ["type", "peso", "nombre", "servicio", "version", "host", "seccion"]
          }
        ]
      }
    },
    "template": {
      "type": "string",
      "title": "Plantilla"
    }
  },
  "required": ["items", "template"]
}
