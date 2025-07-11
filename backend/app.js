import dotenv from 'dotenv'
dotenv.config()

import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import routes from './routes/routes.js'
import Rol from './models/Rol.js';
import currentConfig from './config.js';

const app = express();

app.use(cors({
  origin: `http://${currentConfig.IP}:${currentConfig.FRONT_PORT}`,
  credentials: true
}));

// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true })); 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json("API Editor Argenmap");
});

// Uso de rutas
app.use(`/`, routes);

// CARGA DE ROLES
await Rol.init();
console.log("Roles cargados correctamente");

app.listen(currentConfig.API_PORT, () => {
  console.log(`App running on port ${currentConfig.API_PORT}.`);
});