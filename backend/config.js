import dotenv from 'dotenv'
dotenv.config()

const mode = process.env.VITE_MODE;

const config = {
  dev: {
    IP: process.env.VITE_DEV_IP,
    API_PORT: process.env.VITE_DEV_API_PORT,
    FRONT_PORT: process.env.DEV_FRONT_PORT,
    DB_HOST: process.env.DEV_DB_HOST,
    DB_PORT: process.env.DEV_DB_PORT,
    DB_NAME: process.env.DEV_DB_NAME,
    DB_USER: process.env.DEV_DB_USER,
    DB_PASS: process.env.DEV_DB_PASS
  },
  uat: {
    IP: process.env.VITE_UAT_IP,
    API_PORT: process.env.VITE_UAT_API_PORT,
    FRONT_PORT: process.env.UAT_FRONT_PORT,
    DB_HOST: process.env.UAT_DB_HOST,
    DB_PORT: process.env.UAT_DB_PORT,
    DB_NAME: process.env.UAT_DB_NAME,
    DB_USER: process.env.UAT_DB_USER,
    DB_PASS: process.env.UAT_DB_PASS
  },
  prod: {
    IP: process.env.VITE_PROD_IP,
    API_PORT: process.env.VITE_PROD_API_PORT,
    FRONT_PORT: process.env.PROD_FRONT_PORT,
    DB_HOST: process.env.PROD_DB_HOST,
    DB_PORT: process.env.PROD_DB_PORT,
    DB_NAME: process.env.PROD_DB_NAME,
    DB_USER: process.env.PROD_DB_USER,
    DB_PASS: process.env.PROD_DB_PASS
  },
};

let currentConfig

if (config[mode]) {
  currentConfig = config[mode]
  console.log(`Variables de entorno leídas correctamente. Modo de ejecucion: Modo: ${mode}`);
} else {
  currentConfig = config['dev']
  console.log("Ha ocurrido un error al cargar las variables de entorno. Se han utilizado las dev por default")
}

export default currentConfig;