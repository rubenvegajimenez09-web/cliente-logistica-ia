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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'La API Key de Gemini (GEMINI_API_KEY) no está configurada.' },
        { status: 500 }
      );
    }

    // Llamada directa a la API de Google Gemini (1.5 Flash)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: message }],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text: 'Eres un asistente experto en logística, gestión de flotas y transporte. Responde de forma clara, directa y estructurada.',
              },
            ],
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Error detallado de Google:', data);
      return NextResponse.json(
        { error: `Google API Error: ${data.error?.message || 'Error en la petición'}` },
        { status: response.status }
      );
    }

    const respuestaIA =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No se pudo generar respuesta.';

    return NextResponse.json({ result: respuestaIA });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno desconocido';
    console.error('Error en servidor:', error);
    return NextResponse.json(
      { error: `Error interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}