import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const port = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Argenmap estatico
app.use('/argenmap', express.static(path.join(__dirname, 'public/argenmap')))

// Servir archivos estáticos para kharta (Si no, rompe. Analizar importaciones por lado de kharta de otra manera vite.config.js quizas)
app.use('/kharta/assets', express.static(path.join(__dirname, 'public/kharta/assets')));

// Endpoint que sirve Kharta e inyecta configuracion
app.get('/kharta', async (req, res) => {
  const { view } = req.query;
  console.log(view)


  ///////////////////////////////
  // TEST MEJORAR PROXIMAMENTE //
  ///////////////////////////////
  let configInyectada = null;

  try {
    const response = await fetch(`http://localhost:3001/visores/share?shareToken=${view}`);
    configInyectada = await response.json(); // Devuelve campo .error si no se pudo
  } catch (error) {
    console.error('Error al hacer fetch:', error);
  }

  ///////////////////////////////////
  // FIN TEST MEJORAR PROXIMAMENTE //
  ///////////////////////////////////

  const indexPath = path.join(__dirname, 'public/kharta/index.html');

  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('Visor kharta no encontrado');
  }

  let html = fs.readFileSync(indexPath, 'utf-8')

  // Agarramos config de ejemplo desde la carpeta statics para inyectarla. Posteriormente debería realizar una búsqueda en DB de la configuración
  const defaultConfigPath = path.join(__dirname, 'statics/map-config.json'); // "Servida desde el editor"
  configInyectada = configInyectada.error ? JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8')) : configInyectada; // Si hay campo .error cargamos default, si no, cargamos la q corresponde
  const scriptTag = `<script id="external-config" type="application/json">${JSON.stringify(configInyectada)}</script>`; // Inyectamos para posteriormente leer en el front
  html = html.replace('</head>', `${scriptTag}</head>`);

  // Ajustamos rutas absolutas a rutas relativas para kharta (Si no, rompe)
  html = html.replace(/(src|href)="\/assets\//g, `$1="/kharta/assets/`);

  res.send(html);
});


app.post('/kharta', async (req, res) => {
  const defaultConfigPath = path.join(__dirname, 'statics/map-config.json');

  const config = req.body.config; // 👈 Parseo correcto
  console.log("Config ", config)
  const indexPath = path.join(__dirname, 'public/kharta/index.html');
  let html = fs.readFileSync(indexPath, 'utf-8');


  const configInyectada = JSON.parse(config) || JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'));

  const scriptTag = `<script id="external-config" type="application/json">${JSON.stringify(configInyectada)}</script>`;

  /*   console.log("Objeto completo:", JSON.stringify(configInyectada, null, 2)); */

  html = html.replace('</head>', `${scriptTag}</head>`);
  html = html.replace(/(src|href)="\/assets\//g, `$1="/kharta/assets/`);

  res.send(html);
});


app.listen(port, () => {
  console.log(`Visor server corriendo en puerto: ${port}`);
});