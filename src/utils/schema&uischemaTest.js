const NEWschema = {
  "type": "object",
  "properties": {
    "app": {
      "type": "object",
      "properties": {
        "version": { "type": "string" }
      }
    },
    "ui": {
      "type": "object",
      "properties": {
        "theme": {
          "type": "object",
          "properties": {
            "bodyBackground": { "type": "string", "format": "color" },
            "headerBackground": { "type": "string", "format": "color" },
            "menuBackground": { "type": "string", "format": "color" },
            "activeLayer": { "type": "string", "format": "color" },
            "textMenu": { "type": "string" },
            "textMenuStyle": { "type": "string" },
            "textLegendMenu": { "type": "string", "format": "color" },
            "textLegendMenuStyle": { "type": "string" },
            "iconBar": { "type": "string", "format": "color" }
          }
        }
      }
    },
    "resources": {
      "type": "object",
      "properties": {
        "leaflet": { "type": "string" }
      }
    }
  }
}

const NEWuischema =  {
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Group",
      "label": "App Configuration",
      "elements": [
        {
          "type": "Control",
          "scope": "#/properties/app/properties/version",
          "label": "App Version"
        }
      ]
    },
    {
      "type": "Group",
      "label": "UI Theme",
      "elements": [
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/bodyBackground",
          "label": "Body Background Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/headerBackground",
          "label": "Header Background Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/menuBackground",
          "label": "Menu Background Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/activeLayer",
          "label": "Active Layer Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/textMenu",
          "label": "Text Menu Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/textLegendMenu",
          "label": "Text Legend Menu Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/iconBar",
          "label": "Icon Bar Color"
        }
      ]
    },
    {
      "type": "Group",
      "label": "Resources",
      "elements": [
        {
          "type": "Control",
          "scope": "#/properties/resources/properties/leaflet",
          "label": "Leaflet URL"
        }
      ]
    }
  ]
}