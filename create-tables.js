import pool from './backend/db/database.js';

async function crearTablas() {
  try {
    await pool.query(`
-- CREAR TABLA USUARIOS
CREATE TABLE usuarios (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    lastOnline TIMESTAMP,
    active BOOLEAN DEFAULT true,
    superadmin BOOLEAN default false
);

-- CREAR TABLA GRUPOS
CREATE TABLE grupos (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    img TEXT
);

-- INSERTAR USUARIO SUPER ADMIN DEFAULT
INSERT INTO usuarios (id, name, lastname, email, password, active, superadmin)
VALUES ('Administrador', 'General', 'administracion@editorargenmap.gob.ar', '$2b$10$s9zmxerhaenjrVR7ioxXteGEj.7gLoX5NHfwW/cxBgehX/AKW2ejG', true, true); -- Super.Admin password

-- CREAR TABLA ROLES
CREATE TABLE roles (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- INSERTAR ROLES
INSERT INTO roles (name) VALUES
('superadmin'),
('groupadmin'),
('editor'),
('lector');

-- CREAR TABLA INTERMEDIA USUARIOS_POR_GRUPO MUCHOS A MUCHOS 
CREATE TABLE usuarios_por_grupo (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuarioId INT NOT NULL,
    grupoId INT NOT NULL,
    rolId INT NOT NULL DEFAULT 4,  -- Suponiendo que 4 es el id de "lector"

    CONSTRAINT fk_usuario FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_grupo FOREIGN KEY (grupoId) REFERENCES grupos(id) ON DELETE CASCADE,
    CONSTRAINT fk_rol FOREIGN KEY (rolId) REFERENCES roles(id),
    CONSTRAINT unique_usuario_grupo UNIQUE (usuarioId, grupoId)
);

-- CREAR TABLA CONFIG
CREATE TABLE config (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    json JSON NOT NULL
);

-- CREAR TABLA VISORES
CREATE TABLE visores (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    gid INTEGER REFERENCES grupos(id),
    cid INTEGER REFERENCES config(id),
    uid INTEGER REFERENCES usuarios(id),
    name TEXT NOT NULL,
    description TEXT,
    img TEXT,
    lastUpdate TIMESTAMP NOT NULL DEFAULT NOW(),
    publico BOOLEAN NOT NULL DEFAULT FALSE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- FUNCIÓN PARA BORRAR CONFIG RELACIONADA A UN VISOR
CREATE OR REPLACE FUNCTION borrar_config_del_visor()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.cid IS NOT NULL THEN
        DELETE FROM config WHERE id = OLD.cid;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER QUE LLAMA A LA FUNCIÓN AL ELIMINAR UN VISOR
CREATE TRIGGER trg_borrar_config
AFTER DELETE ON visores
FOR EACH ROW
EXECUTE FUNCTION borrar_config_del_visor();

-- CREAR TABLA APLICACION
CREATE TABLE aplicacion (
    name TEXT PRIMARY KEY,
    logo TEXT,
    description TEXT
);

-- CREAR TABLA HISTORIAL
CREATE TABLE historial (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    visor_id INTEGER REFERENCES visores(id),
    accion TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT NOW(),
    datos_previos JSON
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