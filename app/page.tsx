'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

// Definición de tipos estrictos sin 'any'
type ExcelRow = Record<string, unknown>;

export default function Home() {
  // Estado para la IA
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para el Procesador de Excel
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [excelStats, setExcelStats] = useState<{
    originalRows: number;
    cleanedRows: number;
    removedDuplicates: number;
    fileName: string;
  } | null>(null);
  const [cleanedData, setCleanedData] = useState<ExcelRow[] | null>(null);

  // Manejador para la IA
  const handleSubmitIA = async (e: React.FormEvent) => {
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
      const errorMessage =
        err instanceof Error ? err.message : 'Error de conexión con el servidor';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Manejador para el archivo Excel/CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
      setExcelStats(null);
      setCleanedData(null);
    }
  };

  const processExcel = () => {
    if (!excelFile) return;
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        if (!buffer) return;

        const data = new Uint8Array(buffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convertir a JSON con tipo estricto
        const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, { defval: '' });
        const totalRows = jsonData.length;

        // Eliminar duplicados exactos
        const uniqueData = jsonData.filter((row, index, self) =>
          index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(row))
        );

        const cleanedRowsCount = uniqueData.length;
        const duplicatesCount = totalRows - cleanedRowsCount;

        setCleanedData(uniqueData);
        setExcelStats({
          originalRows: totalRows,
          cleanedRows: cleanedRowsCount,
          removedDuplicates: duplicatesCount,
          fileName: excelFile.name.replace(/\.[^/.]+$/, '') + '_optimizado.xlsx',
        });
      } catch {
        alert('Error al leer el archivo. Asegúrate de subir un .xlsx o .csv válido.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(excelFile);
  };

  const downloadCleanedFile = () => {
    if (!cleanedData || !excelStats) return;

    const worksheet = XLSX.utils.json_to_sheet(cleanedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos Limpios');

    XLSX.writeFile(workbook, excelStats.fileName);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Background Subtle Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* Navbar Minimalista */}
      <header className="relative z-10 border-b border-slate-800/80 bg-[#0B0F17]/80 backdrop-blur-xl sticky top-0 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              L
            </div>
            <span className="font-semibold text-base text-slate-100 tracking-tight">
              LogiOS <span className="text-xs font-normal text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/50 ml-1.5">v2.4</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              Sistemas Operativos
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-blue-400 border border-slate-700/60 shadow-inner">
            ✨ Plataforma Integral de Logística
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Control Operativo y <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Optimización Inteligente</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Centraliza la gestión de tu flota, procesa datos masivos de inventario y consulta decisiones estratégicas en tiempo real.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* CAJA 1: Optimización de Transporte (PREVIEW) */}
          <div className="relative group bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg backdrop-blur-sm">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-800 text-slate-400 rounded-md border border-slate-700/50">
                Próximamente
              </span>
            </div>
            <div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                🚚
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Optimización de Transporte</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Algoritmos de enrutamiento dinámico para reducir tiempos de tránsito y emisiones de carbono.
              </p>
            </div>
            
            <div className="bg-[#080B11] border border-slate-800/80 rounded-xl p-3 space-y-2 opacity-70">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Ruta M-40 / A-2</span>
                <span className="text-emerald-400 font-mono font-medium">-18% Tiempos</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[72%]" />
              </div>
            </div>
          </div>

          {/* CAJA 2: PROCESADOR Y COMPRESOR EXCEL (FUNCIONAL) */}
          <div className="relative group bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                Módulo Activo
              </span>
            </div>
            <div>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                📊
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Procesador Excel / CSV</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Sube tu plantilla de manifiesto o inventario para eliminar duplicados y estructurar los datos automáticamente.
              </p>

              {/* Zona de Carga de Archivo */}
              <div className="space-y-3">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  id="excel-upload"
                  className="hidden"
                />
                <label
                  htmlFor="excel-upload"
                  className="border border-dashed border-slate-700 hover:border-emerald-500/50 bg-[#080B11] rounded-xl p-3 text-center block cursor-pointer transition-colors"
                >
                  <span className="text-xs text-slate-300 font-medium block truncate">
                    {excelFile ? `📄 ${excelFile.name}` : 'Haz clic para seleccionar .xlsx o .csv'}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Procesamiento local 100% seguro
                  </span>
                </label>

                {excelFile && !excelStats && (
                  <button
                    onClick={processExcel}
                    disabled={isProcessing}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex justify-center items-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? 'Procesando filas...' : 'Optimizar y Limpiar Archivo'}
                  </button>
                )}
              </div>
            </div>

            {/* Resultado del procesamiento */}
            {excelStats && (
              <div className="bg-[#080B11] border border-emerald-500/30 rounded-xl p-3 space-y-2 mt-4">
                <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
                  <span>✅ Optimización Lista</span>
                  <span className="text-[10px] text-slate-400">{excelStats.cleanedRows} filas</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>• Filas originales: <span className="text-slate-200">{excelStats.originalRows}</span></p>
                  <p>• Duplicados eliminados: <span className="text-emerald-400">{excelStats.removedDuplicates}</span></p>
                </div>
                <button
                  onClick={downloadCleanedFile}
                  className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  📥 Descargar Archivo Optimizado
                </button>
              </div>
            )}
          </div>

          {/* CAJA 3: Agenda Logística Operativa (PREVIEW) */}
          <div className="relative group bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-800 text-slate-400 rounded-md border border-slate-700/50">
                Próximamente
              </span>
            </div>
            <div>
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4 border border-purple-500/20">
                📅
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Agenda Logística</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Planificación de ventanas horarias de carga/descarga y alertas de mantenimiento preventivo.
              </p>
            </div>

            <div className="bg-[#080B11] border border-slate-800/80 rounded-xl p-3 space-y-2 opacity-70">
              <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-800/40 p-1.5 rounded border border-slate-800">
                <span className="font-mono text-purple-400">09:30</span>
                <span className="truncate max-w-[120px] text-slate-400">Muelle 04 - Reagrupación</span>
                <span className="text-[10px] text-emerald-400">Confirmado</span>
              </div>
            </div>
          </div>

          {/* CAJA 4: MÓDULO IA ACTIVO */}
          <div className="lg:col-span-3 bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-blue-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <h2 className="text-xl font-bold text-white">Asistente Copilot Logístico (IA)</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Resuelve dudas sobre normativas, gestión de almacenes, costes por km o imprevistos de ruta.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                Módulo Interactivo
              </span>
            </div>

            <form onSubmit={handleSubmitIA} className="space-y-4">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Haz una pregunta estratégica o técnica sobre tu operativa..."
                  className="w-full p-4 rounded-xl bg-[#080B11] text-slate-100 placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-32 resize-none text-sm leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span>Consultar IA</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs sm:text-sm">
                <strong className="font-semibold block mb-1">Aviso del sistema:</strong>
                <p className="text-rose-300/80 font-mono">{error}</p>
              </div>
            )}

            {response && (
              <div className="mt-6 p-6 bg-[#080B11] border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                  <span>💡</span> Análisis Generado
                </div>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal">
                  {response}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="border-t border-slate-800/60 py-8 text-center text-xs text-slate-500">
        <p>© 2026 LogiOS Platform. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}