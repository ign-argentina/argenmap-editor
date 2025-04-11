import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  user: 'user',
  host: 'host',
  database: 'edidatabasetordb',
  password: 'password',
  port: 5432,
});

export default pool;
