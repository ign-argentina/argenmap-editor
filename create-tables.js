import pool from './backend/db.js';

async function crearTablas() {
  try {
    await pool.query(`
      CREATE TABLE grupos (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        img TEXT
      );

      CREATE TABLE config (
        id SERIAL PRIMARY KEY,
        json JSONB NOT NULL
      );

      CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        lastname TEXT,
        pwd TEXT NOT NULL,
        gid INTEGER REFERENCES grupos(id),
        lastOnline TIMESTAMP
      );

      CREATE TABLE grupos_usuarios (
        grupo_id INTEGER REFERENCES grupos(id),
        usuario_id INTEGER REFERENCES usuarios(id),
        PRIMARY KEY (grupo_id, usuario_id)
      );

      CREATE TABLE visores (
        id SERIAL PRIMARY KEY,
        gid INTEGER REFERENCES grupos(id),
        cid INTEGER REFERENCES config(id),
        uid INTEGER REFERENCES usuarios(id),
        name TEXT NOT NULL,
        description TEXT,
        img TEXT,
        lastUpdate TIMESTAMP
      );

      CREATE TABLE aplicacion (
        name TEXT PRIMARY KEY,
        logo TEXT,
        description TEXT
      );

      CREATE TABLE historial (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        visor_id INTEGER REFERENCES visores(id),
        accion TEXT NOT NULL,
        fecha TIMESTAMP DEFAULT NOW(),
        datos_previos JSONB
      );
    `);

    console.log('✅ Todas las tablas fueron creadas con éxito.');
  } catch (err) {
    console.error('❌ Error creando las tablas:', err);
  } finally {
    pool.end();
  }
}

crearTablas();
