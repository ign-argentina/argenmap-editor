// backend/server.js

import express from 'express';
import cors from 'cors';
import pool from './db.js'; // <-- Usamos tu conexión ya existente

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Obtener todos los configs
app.get('/configs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM config ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener configs' });
  }
});

// Crear nuevo config
app.post('/configs', async (req, res) => {
  const { json } = req.body;

  if (!json) {
    return res.status(400).json({ error: 'Falta el campo json' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO config (json) VALUES ($1) RETURNING *',
      [json]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar config' });
  }
});

// Actualizar config existente
app.put('/configs/:id', async (req, res) => {
  const { id } = req.params;
  const { json } = req.body;

  if (!json) {
    return res.status(400).json({ error: 'Falta el campo json' });
  }

  try {
    const result = await pool.query(
      'UPDATE config SET json = $1 WHERE id = $2 RETURNING *',
      [json, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Config no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar config' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
