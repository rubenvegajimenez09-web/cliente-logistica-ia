'use client';

import { useState } from 'react';

interface DatosAlbaran {
  numeroAlbaran: string;
  fecha: string;
  remitente: string;
  destinatario: string;
  origen: string;
  destino: string;
  bultos: number;
  pesoKg: number;
  precioTotal: number;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<DatosAlbaran | null>(null);

  const handleProcesar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setResultado({
        numeroAlbaran: 'ALB-2026-8891',
        fecha: '05/08/2026',
        remitente: 'Transportes TransEspuña S.L.',
        destinatario: 'Distribuciones Levante',
        origen: 'Murcia',
        destino: 'Barcelona',
        bultos: 12,
        pesoKg: 450.5,
        precioTotal: 620.00,
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Header Corporativo */}
      <header className="w-full border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-tight text-lg text-white">LogiData</span>
            <span className="text-[11px] uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              Enterprise
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Soporte técnico
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl px-6 py-12 flex flex-col gap-8">
        
        {/* Título de la herramienta */}
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">
            Extracción de Albaranes de Transporte
          </h1>
          <p className="text-sm text-slate-400">
            Carga de documentos escaneados para conversión estructurada en hoja de cálculo.
          </p>
        </div>

        {/* Panel de Carga */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <form onSubmit={handleProcesar} className="flex flex-col gap-4">
            
            <div className="border border-dashed border-slate-700 hover:border-slate-500 rounded bg-slate-950/50 p-8 text-center transition-colors">
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <span className="text-sm font-medium text-slate-200 underline underline-offset-4">
                  Seleccionar documento PDF o imagen
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  Formatos admitidos: PDF, PNG, JPG (Máx. 10MB)
                </span>
              </label>
            </div>

            {file && (
              <div className="flex justify-between items-center bg-slate-800/50 border border-slate-700/50 px-4 py-2 rounded text-xs">
                <span className="text-slate-300 font-mono">{file.name}</span>
                <span className="text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!file || loading}
                className="bg-slate-100 hover:bg-white text-slate-900 text-xs font-semibold px-4 py-2.5 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando archivo...' : 'Procesar documento'}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla Sobria de Resultados */}
        {resultado && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-medium text-slate-200">
                Resultado de extracción
              </h2>
              <button
                onClick={() => alert('Descarga de Excel')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded border border-slate-700 transition-colors"
              >
                Exportar a Excel (.xlsx)
              </button>
            </div>

            <table className="w-full text-left text-xs text-slate-300">
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="px-6 py-3 font-medium text-slate-500 bg-slate-950/30 w-1/3">Nº Albarán</td>
                  <td className="px-6 py-3 font-mono">{resultado.numeroAlbaran}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-slate-500 bg-slate-950/30">Fecha</td>
                  <td className="px-6 py-3">{resultado.fecha}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-slate-500 bg-slate-950/30">Remitente</td>
                  <td className="px-6 py-3">{resultado.remitente}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-slate-500 bg-slate-950/30">Destinatario</td>
                  <td className="px-6 py-3">{resultado.destinatario}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-slate-500 bg-slate-950/30">Origen / Destino</td>
                  <td className="px-6 py-3">{resultado.origen} ➔ {resultado.destino}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-slate-500 bg-slate-950/30">Bultos / Peso</td>
                  <td className="px-6 py-3">{resultado.bultos} bultos ({resultado.pesoKg} kg)</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-slate-500 bg-slate-950/30">Importe Total</td>
                  <td className="px-6 py-3 font-semibold text-slate-100">{resultado.precioTotal.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}