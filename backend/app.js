import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import routes from './routes/routes.js'

dotenv.config()
const app = express();

const PORT = process.env.PORT || 3001;

console.log(process.env.PORT)
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get("/", (_req, res) => {
  res.json("API Editor Argenmap" );
});

/****** USO DE RUTAS  ******/
//app.use(`/v1/editor`, routes);
app.use(`/`, routes);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});