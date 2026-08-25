    /* eslint-disable @typescript-eslint/no-require-imports */
    const { Pool } = require('pg');
    const bcrypt = require('bcrypt');
    require('dotenv').config({ path: '.env.local' });

    const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    });

    async function setup() {
    try {
        await pool.query(`
        );
        `);
        console.log('Tabla "users" creada correctamente.');

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

        console.log(" Usuarios de prueba insertados con contraseñas hasheadas.");
    } catch (error) {
        console.error(" Error configurando la base de datos:", error);
    } finally {
        await pool.end();
    }
    }

    setup();
