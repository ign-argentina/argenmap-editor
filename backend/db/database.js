
import pkg from 'pg';
import dotenv from 'dotenv'
dotenv.config()

const {Pool} = pkg;
const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, 
  database: process.env.DB_NAME, 
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  max: 10,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0
});

export default db;