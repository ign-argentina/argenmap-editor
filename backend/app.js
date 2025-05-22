import dotenv from 'dotenv'
dotenv.config()

import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import routes from './routes/routes.js'

const app = express();

console.log(process.env.PORT != undefined ? "Varibles de entorno leidas correctamente" : "ERROR AL LEER LAS VARIABLES DE ENTORNO")
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json("API Editor Argenmap" );
});


// Uso de rutas
app.use(`/`, routes);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});