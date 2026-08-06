'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error inesperado');
      } else {
        setResponse(data.result);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión con el servidor';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
        <h1 className="text-2xl font-bold mb-4 text-blue-400">
          Asistente de Logística e IA
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta sobre logística o transporte aquí..."
            className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando con la IA...' : 'Enviar a la IA'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            <strong>Respuesta:</strong>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-6 p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 whitespace-pre-line">
            <strong>Respuesta de la IA:</strong>
            <p className="mt-2 text-slate-200 leading-relaxed">{response}</p>
          </div>
        )}
      </div>
    </main>
  );
}