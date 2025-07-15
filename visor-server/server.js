import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const port = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

// Argenmap estatico
app.use('/argenmap', express.static(path.join(__dirname, 'public/argenmap')))

// Servir archivos estáticos para kharta (Si no, rompe. Analizar importaciones por lado de kharta de otra manera vite.config.js quizas)
app.use('/kharta/assets', express.static(path.join(__dirname, 'public/kharta/assets')));

// Endpoint que sirve Kharta e inyecta configuracion
app.get('/kharta', (req, res) => {
  const indexPath = path.join(__dirname, 'public/kharta/index.html');

  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('Visor kharta no encontrado');
  }

  let html = fs.readFileSync(indexPath, 'utf-8');

  // Agarramos config de ejemplo desde la carpeta statics para inyectarla. Posteriormente debería realizar una búsqueda en DB de la configuración
  const configPath = path.join(__dirname, 'statics/map-config.json'); // "Servida desde el editor"
  const configInyectada = JSON.parse(fs.readFileSync(configPath, 'utf-8')); // Parseamos
  const scriptTag = `<script id="external-config" type="application/json">${JSON.stringify(configInyectada)}</script>`; // Inyectamos para posteriormente leer en el front
  html = html.replace('</head>', `${scriptTag}</head>`);

  // Ajustamos rutas absolutas a rutas relativas para kharta (Si no rompe)
  html = html.replace(/(src|href)="\/assets\//g, `$1="/kharta/assets/`);

  res.send(html);
});

app.listen(port, () => {
  console.log(`Visor server corriendo en puerto: ${port}`);
});