// crear-tabla.js
import pool from './backend/db.js';


async function crearTabla() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS visores (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      config JSONB NOT NULL
    );
  `);
  console.log("Tabla creada.");
  pool.end();
}


crearTabla();
