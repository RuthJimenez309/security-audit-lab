import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Simulación de usuarios 
    if (username === 'admin' && password === 'Admin123*') {
      return NextResponse.json({ 
        success: true, 
        token: 'fake-jwt-token-admin', 
        role: 'admin',
        message: 'Bienvenido Administrador' 
      });
    } else if (username === 'user' && password === 'User123*') {
      return NextResponse.json({ 
        success: true, 
        token: 'fake-jwt-token-user', 
        role: 'user',
        message: 'Bienvenido Usuario' 
      });
    }

    return NextResponse.json({ success: false, message: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error en el servidor' }, { status: 500 });
  }
}