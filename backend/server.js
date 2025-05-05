// backend/server.js
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Crear un nuevo visor
app.post('/visores', async (req, res) => {
  const { name, description, json } = req.body;

  if (!name || !json) {
    return res.status(400).json({ error: 'Faltan datos obligatorios (name o json)' });
  }

  try {
    // Primero insertamos en config
    const configResult = await pool.query(
      'INSERT INTO config (json) VALUES ($1) RETURNING id',
      [JSON.stringify(json)]
    );

    const cid = configResult.rows[0].id;
    const id = uuidv4(); // ID único del visor
    const now = new Date();

    const visorResult = await pool.query(
      `INSERT INTO visores (id, cid, name, description, lastUpdate)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, cid, name, description || null, now]
    );

    res.status(201).json(visorResult.rows[0]);
  } catch (err) {
    console.error('Error creando visor:', err);
    res.status(500).json({ error: 'Error creando visor' });
  }
});

// Obtener todos los visores
app.get('/visores', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT v.id, v.name, v.description, v.lastUpdate, c.json
       FROM visores v
       JOIN config c ON v.cid = c.id
       ORDER BY v.lastUpdate DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo visores:', err);
    res.status(500).json({ error: 'Error al obtener visores' });
  }
});

// Eliminar visor
app.delete('/visores/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminar primero el visor (la config puede quedar si querés, o también borrarla después)
    await pool.query('DELETE FROM visores WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error eliminando visor:', err);
    res.status(500).json({ error: 'Error al eliminar visor' });
  }
});

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
      [JSON.stringify(json)] // <--- ¡IMPORTANTE!
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
