
import pkg from 'pg';
import currentConfig from '../config.js'

const { Pool } = pkg;
const db = new Pool({
  host: currentConfig.DB_HOST,
  port: currentConfig.DB_PORT,
  database: currentConfig.DB_NAME,
  user: currentConfig.DB_USER,
  password: currentConfig.DB_PASS,
  max: 10,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0
});

export default db;