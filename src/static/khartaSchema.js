export const khartaSchema = {
  type: "object",
  properties: {
    mapConfig: {
      type: "object",
      properties: {
        center: {
          type: "object",
          properties: {
            latitude: { type: "number" },
            longitude: { type: "number" }
          },
          required: ["latitude", "longitude"],
          additionalProperties: false
        },
        zoom: {
          type: "object",
          properties: {
            initial: { type: "number" },
            min: { type: "number" },
            max: { type: "number" }
          },
          required: ["initial", "min", "max"],
          additionalProperties: false
        }
      },
      required: ["center", "zoom"],
      additionalProperties: false
    },
    metaTags: {
      type: "object",
      properties: {
        description: { type: "string" },
        image: { type: "string" },
        title: { type: "string" }
      },
      required: ["description", "image", "title"],
      additionalProperties: false
    },
    title: { type: "string" },
    website: { type: "string" },
    logo: {
      type: "object",
      properties: {
        title: { type: "string" },
        link: { type: "string" },
        src: { type: "string" }
      },
      required: ["title", "link", "src"],
      additionalProperties: false
    },
    plugins: {
      type: "object",
      additionalProperties: true
    },
    basemap: {
      type: "array",
      items: {
        type: "object",
        properties: {
          titulo: { type: "string" },
          nombre: { type: "string" },
          servicio: { type: "string" },
          version: { type: "string" },
          attribution: { type: "string" },
          host: { type: "string" },
          legendImg: { type: "string" },
          legend: { type: "string" },
          peso: { type: "number" },
          selected: { type: "boolean" },
          zoom: {
            type: "object",
            properties: {
              min: { type: "number" },
              max: { type: "number" }
            },
            required: ["min", "max"],
            additionalProperties: false
          }
        },
        required: ["titulo", "nombre", "host"],
        additionalProperties: false
      },
      minItems: 1
    },
    layers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          peso: { type: "number" },
          nombre: { type: "string" },
          short_abstract: { type: "string" },
          host: { type: "string" }
        },
        required: ["type", "nombre", "host"],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: ["mapConfig", "metaTags", "title", "website", "logo", "basemap", "layers"],
  additionalProperties: false
}