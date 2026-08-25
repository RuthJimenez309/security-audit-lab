import { NextResponse } from "next/server";



const notes = [
  {
    id: 1,
    title: "Nota pública",
    content: "Cualquiera puede leer esto",
    restricted: false,
  },
  {
    id: 2,
    title: "Secreto corporativo",
    content: "Solo para administradores",
    restricted: true,
  },
];

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "No autorizado - Token ausente" },
      { status: 401 },
    );
  }

  const isAdmin = authHeader.includes("admin");

  const accessibleNotes = isAdmin ? notes : notes.filter((n) => !n.restricted);

  return NextResponse.json({ success: true, data: accessibleNotes });
}
