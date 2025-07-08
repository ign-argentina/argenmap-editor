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

app.use('/visor/argenmap', express.static(path.join(__dirname, 'public/argenmap')));
app.use('/visor/kharta', express.static(path.join(__dirname, 'public/kharta')));

app.get('/visor/:visor', (req, res) => {
  const visor = req.params.visor;
  const indexPath = path.join(__dirname, `public/${visor}/index.html`);
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Visor no encontrado');
  }
});

app.listen(port, () => {
  console.log(`🔭 Visor server corriendo en http://localhost:${port}/visor/argenmap`);
});