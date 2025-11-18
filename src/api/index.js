const mode = import.meta.env.VITE_MODE;

const config = {
  dev: {
    IP: import.meta.env.VITE_DEV_IP,
    API_PORT: import.meta.env.VITE_DEV_API_PORT
  },
  uat: {
    IP: import.meta.env.VITE_UAT_IP,
    API_PORT: import.meta.env.VITE_UAT_API_PORT
  },
  prod: {
    IP: import.meta.env.VITE_PROD_IP,
    API_PORT: import.meta.env.VITE_PROD_API_PORT
  },
};

let currentConfig

if (config[mode]) {
  currentConfig = config[mode]
} else {
  currentConfig = config['dev']
}

// SEGUIR
export const API_URL = `http://${currentConfig.IP}:${currentConfig.API_PORT}`;