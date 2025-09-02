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
/* app.use(cors({ origin: 'http://localhost:5173' })); // permitir tu frontend */
app.use(cors());


// ---- STATIC: Argenmap ----
app.use('/argenmap', express.static(path.join(__dirname, 'public/argenmap')));

// Middleware to redirect dynamic JS/CSS requests from /src/ to /argenmap/src/
app.use('/src', (req, res, next) => {
  // Only redirect if the request comes from the /map endpoint context
  const referer = req.get('Referer');
  if (referer && referer.includes('/map')) {
    // Redirect to the correct argenmap path
    const newPath = `/argenmap${req.originalUrl}`;
    res.redirect(302, newPath);
  } else {
    // For other contexts, pass through (might be kharta or other uses)
    next();
  }
});


// Servir archivos estáticos para kharta (Si no, rompe. Analizar importaciones por lado de kharta de otra manera vite.config.js quizas)
// ---- STATIC: Kharta ----
app.use('/kharta/assets', express.static(path.join(__dirname, 'public/kharta/assets')));

app.post('/argenmap/custom', async (req, res) => {
  try {
    const { data, preferences } = req.body;
    const html = await getArgenMap({ data, preferences })
    return res.status(200).send(html)
  } catch (err) {
    console.error('Error loading index.html or JSON:', err);
    res.status(500).send('Server error');
  }
});


// Endpoint que sirve Kharta e inyecta configuracion || ESTE ENDPOINT SE USA PARA EL SHARE
app.get('/map', async (req, res) => {
  const { view } = req.query;

  if (!view) {
    return res.status(404).send("Acceso inválido")
  }
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

  // Fixed null check: ensure configInyectada exists before checking .preferences
  const isArgenmap = configInyectada && configInyectada.preferences != null;

  ///////////////////////////////////
  // FIN TEST MEJORAR PROXIMAMENTE //
  ///////////////////////////////////

  let html = isArgenmap ? await getArgenMap(configInyectada, view) : await getKhartaMap(configInyectada);

  return html != null ? res.send(html) : res.status(404).send("Visor no encontrado");
});

const getKhartaMap = async (configInyectada) => {
  const indexPath = path.join(__dirname, 'public/kharta/index.html');
  if (!existsSync(indexPath)) {
    return null;
  }
  let html = await fs.readFile(indexPath, 'utf-8');

  // Agarramos config de ejemplo desde la carpeta statics para inyectarla. Posteriormente debería realizar una búsqueda en DB de la configuración
  const defaultConfigPath = path.join(__dirname, 'statics/map-config.json'); // "Servida desde el editor"

  // Fixed null check: ensure configInyectada exists before checking .error
  if (!configInyectada || configInyectada.error) {
    configInyectada = JSON.parse(await fs.readFile(defaultConfigPath, 'utf-8'));
  }

  const scriptTag = `<script id="external-config" type="application/json">${JSON.stringify(configInyectada)}</script>`; // Inyectamos para posteriormente leer en el front
  html = html.replace('</head>', `${scriptTag}</head>`);

  // Ajustamos rutas absolutas a rutas relativas para kharta (Si no, rompe)
  html = html.replace(/(src|href)="\/assets\//g, `$1="/kharta/assets/`);

  return html;
}

const getArgenMap = async (config, viewToken = false) => {
  const webPath = path.join(__dirname, 'public/argenmap/index.html');
  if (!existsSync(webPath)) {
    return null;
  }

  let html = await fs.readFile(webPath, 'utf-8');

  let data = config.data;
  let preferences = config.preferences;

  // Handle default config if needed
  if (!data || !preferences || config.error) {
    const DEFAULT_CONFIG = {
      data: path.join(__dirname, 'statics/argenmap/data.json'),
      preferences: path.join(__dirname, 'statics/argenmap/preferences.json')
    };

    if (!data || config.error) {
      data = JSON.parse(readFileSync(DEFAULT_CONFIG.data, 'utf-8'));
    }
    if (!preferences || config.error) {
      preferences = JSON.parse(readFileSync(DEFAULT_CONFIG.preferences, 'utf-8'));
    }
  }

  // Si vienen como string, los parseo
  if (typeof data === "string") data = JSON.parse(data);
  if (typeof preferences === "string") preferences = JSON.parse(preferences);

  let injectScript = `
          <script>
            window.appData = ${JSON.stringify(data)};
            window.appPreferences = ${JSON.stringify(preferences)};
          </script>
        `;

  if (viewToken) {
    // Construct the original URL from server side
    const originalURL = `/map?view=${viewToken}`;

    // Inyectar datos de ejecución (similar a kharta pero con window.appData y window.appPreferences)
    // El peor fix que hice en mi vida (hasta hoy)
    injectScript = `
<script>
  // El peor fix que hice en mi vida (hasta hoy)

  window.appData = ${JSON.stringify(data)};
  window.appPreferences = ${JSON.stringify(preferences)};
  
  // Almacena la URL original del lado del servidor (no desde la ubicación del cliente)
  window.originalViewURL = '${originalURL}';
  
  // Dejar que URLInteraction se inicialice, luego restaurar la URL y desactivar actualizaciones
  window.addEventListener('load', function() {
    setTimeout(function() {
      // Restaura la URL original que te da el visor (para que la gente pueda copiar y pegar)
      history.replaceState(null, null, window.originalViewURL);
      
      // Desactiva futuras actualizaciones de la URL sobrescribiendo el método updateURL
      if (typeof urlInteraction !== 'undefined' && urlInteraction.updateURL) {
        urlInteraction.updateURL = function() {
          // Bloque vacío - sin console log
        };
      }
      
      // También sobrescribe los métodos de historial para evitar cambios futuros
      history.replaceState = function() {
        // Bloque vacío - sin console log
      };
      history.pushState = function() {
        // Bloque vacío - sin console log
      };
    }, 1000);
  });
</script>
  `;
  }


  html = html.replace('</head>', `${injectScript}\n</head>`);

  // Reemplazo robusto de rutas relativas por absolutas (sin base href para evitar redirección)
  html = html.replace(/(src|href)="src\//g, `$1="/argenmap/src/`);
  html = html.replace(/(src|href)="assets\//g, `$1="/argenmap/assets/`);
  html = html.replace(/(src|href)="js\//g, `$1="/argenmap/js/`);
  html = html.replace(/(src|href)="css\//g, `$1="/argenmap/css/`);
  html = html.replace(/(src|href)="images\//g, `$1="/argenmap/images/`);
  html = html.replace(/(src|href)="plugins\//g, `$1="/argenmap/plugins/`);
  html = html.replace(/(src|href)="(?!https?:\/\/|\/)([^"]+)"/g, (match, p1, p2) => {
    return `${p1}="/argenmap/${p2}"`;
  });
  // Mantengo los links externos intactos
  html = html.replace(/\/argenmap\/https:/g, 'https:');

  return html;
}

app.post('/kharta', async (req, res) => { // ESTE ENDPOINT SE USA PARA LA COMUNICACION CONSTANTE
  const defaultConfigPath = path.join(__dirname, 'statics/map-config.json');

  const config = req.body.config; // 👈 Parseo correcto
  const indexPath = path.join(__dirname, 'public/kharta/index.html');
  let html = await fs.readFile(indexPath, 'utf-8');


  const configInyectada = JSON.parse(config) || JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'));

  const scriptTag = `<script id="external-config" type="application/json">${JSON.stringify(configInyectada)}</script>`;

  html = html.replace('</head>', `${scriptTag}</head>`);
  html = html.replace(/(src|href)="\/assets\//g, `$1="/kharta/assets/`);

  res.send(html);
});

app.post('/kharta/custom', async (req, res) => {
  let browser = null;
  try {
    const defaultConfigPath = path.join(__dirname, 'statics/map-config.json');
    const khartaIndexPath = path.join(__dirname, 'public/kharta/index.html');
    const argenmapIndexPath = path.join(__dirname, 'public/argenmap/index.html');

    // Read the configuration from request body or use default
    const config = req.body.config;

    const isArgenmap = !!(config.data && config.preferences);
    let html = await fs.readFile((isArgenmap ? argenmapIndexPath : khartaIndexPath), 'utf-8');

    const defaultConfig = await fs.readFile(defaultConfigPath, 'utf-8');

    let configInyectada, scriptTag

    if (isArgenmap) {
      scriptTag = `
      <script>
        window.appData = ${JSON.stringify(config.data)};
        window.appPreferences = ${JSON.stringify(config.preferences)};
      </script>
    `;
    } else {
      configInyectada = config ? config : JSON.parse(defaultConfig);
      scriptTag = `<script id="external-config" type="application/json">${JSON.stringify(configInyectada)}</script>`;
    }

    // Inject the configuration and adjust asset paths
    if (isArgenmap) {
      // Add base href for Argenmap to fix relative paths
      html = html.replace('<head>', '<head>\n  <base href="/argenmap/">');
    }

    html = html.replace('</head>', `${scriptTag}</head>`);

    if (!isArgenmap) {
      html = html.replace(/(src|href)="\/assets\//g, `$1="/kharta/assets/`);
    } else {
      // Fix Argenmap asset paths to be absolute from the /argenmap route
      // Fix relative paths that start with "src/"
      html = html.replace(/(src|href)="src\//g, `$1="/argenmap/src/`);

      // Fix any other relative paths that don't start with http, https, or /
      html = html.replace(/(src|href)="(?!https?:\/\/|\/)/g, `$1="/argenmap/`);

      // Make sure bootstrap and external CDN links remain intact
      html = html.replace(/\/argenmap\/https:/g, 'https:');
    }


    // Launch browser for screenshot
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    // Set viewport
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 0.5,
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
    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      fullPage: false,
      encoding: 'binary'
    });

    // Set response headers and send image
    const imageBase64 = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;
    res.status(200).send({ img: imageBase64 });

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