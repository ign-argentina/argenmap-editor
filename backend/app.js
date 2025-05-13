import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import dotenv from 'dotenv'
import routes from './routes/routes.js'

dotenv.config()
const app = express();

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