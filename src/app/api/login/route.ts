import { NextResponse } from "next/server";
import { db } from "../../lib/db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro_para_lab";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

    // 1. Buscar usuario en PostgreSQL de forma segura (Previene SQL Injection)
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      await db.query(
        "INSERT INTO audit_logs (username, action, status) VALUES ($1, $2, $3)",
        [username, "LOGIN_ATTEMPT", "FAILED_USER_NOT_FOUND"],
      );
      return NextResponse.json(
        { success: false, message: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    const user = result.rows[0];

    // 2. Comparar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      await db.query(
        "INSERT INTO audit_logs (username, action, status) VALUES ($1, $2, $3)",
        [username, "LOGIN_ATTEMPT", "FAILED_INVALID_PASSWORD"],
      );
      return NextResponse.json(
        { success: false, message: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    // 3. Registrar acceso exitoso en la auditoría
    await db.query(
      "INSERT INTO audit_logs (username, action, status) VALUES ($1, $2, $3)",
      [username, "LOGIN_ATTEMPT", "SUCCESS"],
    );

    // 4. Generar el JWT real
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    return NextResponse.json({
      success: true,
      token,
      role: user.role,
      message: `Bienvenido ${user.username}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Error interno en el servidor" },
      { status: 500 },
    );
  }
}
