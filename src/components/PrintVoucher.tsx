import React from 'react';
import { ChecklistData } from '../types/checklist';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, Check, X as XIcon } from 'lucide-react';

interface PrintVoucherProps {
  record: ChecklistData;
  onClose: () => void;
}

export const PrintVoucher: React.FC<PrintVoucherProps> = ({ record, onClose }) => {
  const isAprobado = record.estadoFinal === 'APROBADO' || record.estadoFinal === 'APTO';
  const fechaStr =
    record.fechaAmigable ||
    new Date(record.fechaHora).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const folioStr = record.folio || record.id || 'CKL-COL-00113';

  // Format CD display: remove "DC " if present to show e.g. "GALAPA" or "LA ARENOSA"
  const cdLimpio = (record.centroDistribucion || 'GALAPA')
    .replace(/^DC\s+/i, '')
    .trim()
    .toUpperCase();

  const tipoOperacion = (record.tipo || 'Salida').toUpperCase();
  const actaTitulo = `ACTA DE ${tipoOperacion} - ${cdLimpio}`;

  // Cadena oficial solicitada
  const finalSummaryLine = `EXITOSO - ${fechaStr} - ${record.placa} - ${folioStr} - ${record.centroDistribucion} - ${record.conductorNombre}`;

  // QR verification payload
  const qrValidationValue = JSON.stringify({
    sicl: 'SICL-BU-COL',
    folio: folioStr,
    placa: record.placa,
    cd: cdLimpio,
    operador: record.conductorNombre,
    fecha: fechaStr,
    dictamen: isAprobado ? 'APROBADO' : 'RECHAZADO',
    fallas: record.totalNoCumple,
    km: record.kilometraje,
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6 print:p-0 print:bg-white print:static">
      {/* Barra superior de acciones (oculta al imprimir) */}
      <div className="w-full max-w-2xl flex items-center justify-between bg-slate-900 border border-slate-700 text-white p-3 rounded-xl mb-4 print:hidden shadow-lg">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-emerald-400">Pase Digital SICL</span>
          <span className="text-xs text-slate-400 font-mono">({folioStr})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar como PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          CONTENEDOR IMPRIMIBLE DEL COMPROBANTE (ESTRUCTURA TIPO PASE)
          ========================================================================= */}
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:border-none print:shadow-none print:w-full print:rounded-none">
        {/* 1. ENCABEZADO DE ESTADO (Banner Superior) */}
        <div
          className={`px-6 py-6 text-center text-white ${
            isAprobado ? 'bg-[#1E6B43]' : 'bg-[#991B1B]'
          } print:bg-[#1E6B43]`}
          style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
        >
          {/* Icono superior centrado en círculo verde claro con borde blanco */}
          <div className="relative inline-flex items-center justify-center mb-2.5">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center border-[2.5px] border-white shadow-sm ${
                isAprobado ? 'bg-[#2E8B57]' : 'bg-[#DC2626]'
              }`}
              style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
            >
              {isAprobado ? (
                <Check className="w-8 h-8 text-white stroke-[3.5]" />
              ) : (
                <XIcon className="w-8 h-8 text-white stroke-[3.5]" />
              )}
            </div>
          </div>

          {/* Título principal en blanco, negrita y mayúsculas */}
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase leading-snug">
            {isAprobado
              ? 'DICTAMEN DE INSPECCIÓN - VEHÍCULO APROBADO'
              : 'DICTAMEN DE INSPECCIÓN - VEHÍCULO RECHAZADO'}
          </h1>

          {/* Subtexto debajo del título */}
          <p className="text-xs sm:text-sm text-emerald-100 font-normal mt-1 max-w-md mx-auto">
            {isAprobado
              ? 'El vehículo cumple las condiciones requeridas para operar en patio y ruta.'
              : 'El vehículo NO cumple las condiciones requeridas para operar en patio y ruta.'}
          </p>
        </div>

        {/* 2 & 3. CUERPO PRINCIPAL DEL PASE */}
        <div className="p-6 sm:p-8 bg-[#F8F9FA]/60">
          {/* 2. TÍTULO DE SECCIÓN */}
          <div className="mb-6 pb-3 border-b border-slate-200">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {actaTitulo}
            </h2>
          </div>

          {/* 3. ESTRUCTURA PRINCIPAL (Diseño fluido tipo pase) */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* A la izquierda: Listado vertical limpio de datos clave */}
            <div className="col-span-7 space-y-4">
              {/* OPERADOR */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Operador
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-900 block leading-tight">
                  {record.conductorNombre}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  C.C. {record.conductorCedula}
                </span>
              </div>

              {/* FOLIO/ID */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Folio/ID
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-slate-900 tracking-wide">
                  {folioStr}
                </span>
              </div>

              {/* FECHA */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Fecha
                </span>
                <span className="text-sm sm:text-base font-medium text-slate-800">
                  {fechaStr}
                </span>
              </div>

              {/* PLACA */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Placa
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-slate-950 tracking-wider">
                  {record.placa}
                </span>
              </div>

              {/* KILOMETRAJE */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Kilometraje
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
                  {Number(record.kilometraje).toLocaleString('es-CO')} km
                </span>
              </div>

              {/* FALLAS DETECTADAS */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Fallas Detectadas
                </span>
                <span
                  className={`text-sm sm:text-base font-bold ${
                    record.totalNoCumple === 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {record.totalNoCumple === 0
                    ? '0 (Ninguna)'
                    : `${record.totalNoCumple} novedad(es) registrada(s)`}
                </span>
              </div>
            </div>

            {/* A la derecha: Código QR grande y claro */}
            <div className="col-span-5 flex flex-col items-center justify-center pt-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                <QRCodeSVG
                  value={qrValidationValue}
                  size={140}
                  level="M"
                  includeMargin={false}
                  className="w-32 h-32 sm:w-36 sm:h-36"
                />
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mt-3 max-w-[170px] leading-tight">
                Código de Validación Digital - Escanee para Verificar
              </p>
            </div>
          </div>

          {/* Cadena Oficial Impresa */}
          <div className="mt-6 p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-slate-800 font-bold break-all">
            {finalSummaryLine}
          </div>

          {/* Observaciones si las hay */}
          {record.observacionesGenerales && (
            <div className="mt-4 p-3 rounded-lg bg-white border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-0.5">Observaciones:</span>
              <p className="text-slate-800 italic">{record.observacionesGenerales}</p>
            </div>
          )}

          {/* Firmas de Autorización para Garita / Control */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs text-center mt-6">
            <div>
              <div className="border-b border-slate-400 pb-7 mb-1"></div>
              <span className="font-bold text-slate-900 block">{record.conductorNombre}</span>
              <span className="text-slate-500 block text-[11px]">C.C. {record.conductorCedula}</span>
              <span className="text-[10px] text-slate-400 block uppercase">Operador / Conductor</span>
            </div>

            <div>
              <div className="border-b border-slate-400 pb-7 mb-1"></div>
              <span className="font-bold text-slate-900 block">Garita de Control / Despacho</span>
              <span className="text-slate-500 block text-[11px]">{cdLimpio} • Regional Norte</span>
              <span className="text-[10px] text-slate-400 block uppercase">Firma y Sello de Salida</span>
            </div>
          </div>
        </div>

        {/* 4. PIE DE PÁGINA (Footer) */}
        <div className="bg-[#F8F9FA] px-4 py-3.5 border-t border-slate-200 text-center">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            SISTEMA INTEGRAL DE CONTROL LOGÍSTICO (SICL) - COMPROBANTE DE {tipoOperacion}
          </p>
        </div>
      </div>
    </div>
  );
};
