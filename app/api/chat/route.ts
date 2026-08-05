import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'El mensaje es obligatorio' },
        { status: 400 }
      );
    }

    const respuestaIA = `Procesando solicitud de logística para: "${message}"`;

    return NextResponse.json({ result: respuestaIA });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}