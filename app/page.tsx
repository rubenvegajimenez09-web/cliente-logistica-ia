'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setCargando(true);
    setRespuesta('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (res.ok) {
        setRespuesta(data.result);
      } else {
        setRespuesta(`Error: ${data.error}`);
      }
    } catch (err) {
      setRespuesta('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-900 text-white">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Cliente Logística IA
        </h1>

        <form onSubmit={enviarConsulta} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta de logística..."
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {cargando ? 'Procesando...' : 'Enviar a la IA'}
          </button>
        </form>

        {respuesta && (
          <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
            <h2 className="text-sm font-semibold text-slate-400 mb-1">Respuesta:</h2>
            <p className="text-slate-200">{respuesta}</p>
          </div>
        )}
      </div>
    </main>
  );
}