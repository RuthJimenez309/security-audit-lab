import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro_para_lab";

const notes = [
  {
    id: 1,
    title: "Nota pública",
    content: "Cualquier usuario autenticado puede leer esto",
    restricted: false,
  },
  {
    id: 2,
    title: "Secreto corporativo",
    content: "Información confidencial exclusiva para administradores",
    restricted: true,
  },
];

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "No autorizado - Token ausente o mal formado" },
      { status: 401 },
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verificar y decodificar el JWT criptográficamente
    const decoded = jwt.verify(token, JWT_SECRET) as {
      role: string;
      username: string;
    };

    // RBAC: Si es admin ve todo, si es user solo lo no restringido
    const isAdmin = decoded.role === "admin";
    const accessibleNotes = isAdmin
      ? notes
      : notes.filter((n) => !n.restricted);

    return NextResponse.json({
      success: true,
      data: accessibleNotes,
      user: decoded.username,
      role: decoded.role,
    });
  } catch {
    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 403 },
    );
  }
}
