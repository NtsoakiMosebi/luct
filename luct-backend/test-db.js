const pool = require('./db');

async function test() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log(rows);
    console.log('Database connection works!');
  } catch (err) {
    console.error('DB connection failed:', err);
  }
}

test();
