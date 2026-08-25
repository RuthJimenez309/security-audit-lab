/* eslint-disable @typescript-eslint/no-require-imports */
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setup() {
  try {
    // 1. Tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL
      );
    `);
    console.log('Tabla "users" lista.');

    // 2. Tabla de registros de auditoría (Audit Logs)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50),
        action VARCHAR(100),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla "audit_logs" lista.');

    const adminPasswordHash = await bcrypt.hash("Admin123*", 10);
    const userPasswordHash = await bcrypt.hash("User123*", 10);

    await pool.query(
      `
      INSERT INTO users (username, password_hash, role)
      VALUES 
        ('admin', $1, 'admin'),
        ('user', $2, 'user')
      ON CONFLICT (username) DO NOTHING;
    `,
      [adminPasswordHash, userPasswordHash],
    );

    console.log("Usuarios de prueba insertados con hashes seguros.");
  } catch (error) {
    console.error(" Error configurando la base de datos:", error);
  } finally {
    await pool.end();
  }
}

setup();
