import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { config } from 'dotenv';

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

// Endpoint que sirve Kharta e inyecta configuracion || ESTE ENDPOINT SE USA PARA EL SHARE
app.get('/kharta', async (req, res) => {
  const { view } = req.query;

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

  if (!existsSync(indexPath)) {
    return res.status(404).send('Visor kharta no encontrado');
  }

  let html = await fs.readFile(indexPath, 'utf-8')

  // Agarramos config de ejemplo desde la carpeta statics para inyectarla. Posteriormente debería realizar una búsqueda en DB de la configuración
  const defaultConfigPath = path.join(__dirname, 'statics/map-config.json'); // "Servida desde el editor"
  configInyectada = configInyectada.error ? JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8')) : configInyectada; // Si hay campo .error cargamos default, si no, cargamos la q corresponde
  const scriptTag = `<script id="external-config" type="application/json">${JSON.stringify(configInyectada)}</script>`; // Inyectamos para posteriormente leer en el front
  html = html.replace('</head>', `${scriptTag}</head>`);

  // Ajustamos rutas absolutas a rutas relativas para kharta (Si no, rompe)
  html = html.replace(/(src|href)="\/assets\//g, `$1="/kharta/assets/`);

  res.send(html);
});


app.post('/kharta', async (req, res) => { // ESTE ENDPOINT SE USA PARA LA COMUNICACION CONSTANTE
  const defaultConfigPath = path.join(__dirname, 'statics/map-config.json');

  const config = req.body.config; // 👈 Parseo correcto
  const indexPath = path.join(__dirname, 'public/kharta/index.html');
  let html = await fs.readFile(indexPath, 'utf-8');


  const configInyectada = JSON.parse(config) || JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'));

  const scriptTag = `<script id="external-config" type="application/json">${JSON.stringify(configInyectada)}</script>`;

  /*   console.log("Objeto completo:", JSON.stringify(configInyectada, null, 2)); */

  html = html.replace('</head>', `${scriptTag}</head>`);
  html = html.replace(/(src|href)="\/assets\//g, `$1="/kharta/assets/`);

  res.send(html);
});


app.post('/kharta/custom', async (req, res) => {
  let browser = null;
  try {
    const defaultConfigPath = path.join(__dirname, 'statics/map-config.json');
    const indexPath = path.join(__dirname, 'public/kharta/index.html');

    // Read the configuration from request body or use default
    const config = req.body.config;
    let html = await fs.readFile(indexPath, 'utf-8');

    const defaultConfig = await fs.readFile(defaultConfigPath, 'utf-8');
    const configInyectada = config ? JSON.parse(config) : JSON.parse(defaultConfig);
    const scriptTag = `<script id="external-config" type="application/json">${JSON.stringify(configInyectada)}</script>`;

    // Inject the configuration and adjust asset paths
    html = html.replace('</head>', `${scriptTag}</head>`);
    html = html.replace(/(src|href)="\/assets\//g, `$1="/kharta/assets/`);

    // Launch browser for screenshot
    /*     console.log('Launching browser...'); */
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();

    /*     // Listen for console messages
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('error', err => console.log('PAGE ERROR:', err));
         */

    // Set viewport
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    // Serve the HTML through a temporary route
    const tempRoutePath = '/temp-render-' + Date.now();
    app.get(tempRoutePath, (_, tempRes) => {
      tempRes.send(html);
    });

    // Navigate to the temporary route
    await page.goto(`http://localhost:${port}${tempRoutePath}`, {
      waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
      timeout: 30000
    });

    // Wait for dynamic content using evaluate
    await page.evaluate(() => new Promise((resolve) => {
      setTimeout(resolve, 2000);
    }));

    // Take the screenshot
    /*    console.log('Taking screenshot...'); */
    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage: true,
      encoding: 'binary'
    });

    // Set response headers and send image
    const imageBase64 = screenshotBuffer.toString('base64');
    res.send({ img: imageBase64 });

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).send(`Error generating image: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
    // Remove the temporary route
    if (app._router && app._router.stack) {
      const routeIndex = app._router.stack.findIndex(layer => layer.route && layer.route.path === tempRoutePath);
      if (routeIndex !== -1) {
        app._router.stack.splice(routeIndex, 1);
      }
    }
  }
});


app.listen(port, () => {
  console.log(`Visor server corriendo en puerto: ${port}`);
});