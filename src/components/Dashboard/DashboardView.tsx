import React, { useState, useMemo } from 'react';
import { ChecklistData, Regional, TipoCheckList } from '../../types/checklist';
import { ITEMS_INSPECCION } from '../../config/checklistItems';
import { exportChecklistsToExcel, exportChecklistsToCSV } from '../../services/storage';
import { DistributionCentersConfig } from '../../config/distributionCenters';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Truck,
  Building2,
  Calendar,
  Printer,
  Eye,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

interface DashboardViewProps {
  checklists: ChecklistData[];
  distributionCenters: DistributionCentersConfig;
  onOpenDetail: (record: ChecklistData) => void;
  onPrintRecord: (record: ChecklistData) => void;
  onNewChecklist: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  checklists,
  distributionCenters,
  onOpenDetail,
  onPrintRecord,
  onNewChecklist,
}) => {
  // Filter states
  const [filterRegional, setFilterRegional] = useState<string>('TODAS');
  const [filterCD, setFilterCD] = useState<string>('TODOS');
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [filterFecha, setFilterFecha] = useState<string>('');

  // Available DCs according to selected regional
  const availableDCs = useMemo(() => {
    if (filterRegional === 'TODAS') {
      return Array.from(
        new Set([
          ...distributionCenters.Norte,
          ...distributionCenters.Sur,
          ...distributionCenters.Centro,
          ...distributionCenters.Andes,
        ])
      ).sort();
    }
    return distributionCenters[filterRegional as Regional] || [];
  }, [filterRegional, distributionCenters]);

  // Filtered dataset
  const filteredChecklists = useMemo(() => {
    return checklists.filter((chk) => {
      if (filterRegional !== 'TODAS' && chk.regional !== filterRegional) return false;
      if (filterCD !== 'TODOS' && chk.centroDistribucion !== filterCD) return false;
      if (filterTipo !== 'TODOS' && chk.tipo !== filterTipo) return false;
      if (filterEstado !== 'TODOS') {
        const isAprobado = chk.estadoFinal === 'APROBADO' || chk.estadoFinal === 'APTO';
        if (filterEstado === 'APROBADO' && !isAprobado) return false;
        if (filterEstado === 'RECHAZADO' && isAprobado) return false;
      }
      if (filterFecha) {
        const itemDate = chk.fechaHora.slice(0, 10);
        if (itemDate !== filterFecha) return false;
      }
      if (filterSearch.trim()) {
        const term = filterSearch.toLowerCase().trim();
        const matchPlaca = chk.placa.toLowerCase().includes(term);
        const matchConductor = chk.conductorNombre.toLowerCase().includes(term);
        const matchCedula = chk.conductorCedula.toLowerCase().includes(term);
        const matchFolio = chk.folio?.toLowerCase().includes(term);
        if (!matchPlaca && !matchConductor && !matchCedula && !matchFolio) return false;
      }
      return true;
    });
  }, [checklists, filterRegional, filterCD, filterTipo, filterEstado, filterFecha, filterSearch]);

  // KPI Calculations
  const totalCount = filteredChecklists.length;
  const aptosCount = filteredChecklists.filter(
    (c) => c.estadoFinal === 'APROBADO' || c.estadoFinal === 'APTO'
  ).length;
  const noAptosCount = totalCount - aptosCount;
  const pctApto = totalCount > 0 ? Math.round((aptosCount / totalCount) * 100) : 0;
  const totalFallas = filteredChecklists.reduce((acc, curr) => acc + curr.totalNoCumple, 0);

  // Top 10 items with most NO CUMPLE
  const topNoCumpleItems = useMemo(() => {
    const counts: Record<string, { count: number; pregunta: string; categoria: string; esCritico?: boolean }> = {};

    ITEMS_INSPECCION.forEach((item) => {
      counts[item.id] = {
        count: 0,
        pregunta: item.pregunta,
        categoria: item.categoria,
        esCritico: item.esCritico,
      };
    });

    filteredChecklists.forEach((chk) => {
      Object.entries(chk.respuestas).forEach(([itemId, resp]) => {
        if (resp.estado === 'NO CUMPLE' && counts[itemId]) {
          counts[itemId].count++;
        }
      });
    });

    return Object.entries(counts)
      .map(([id, data]) => ({ id, ...data }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredChecklists]);

  // Placas with repeated failures
  const placasConIncumplimientos = useMemo(() => {
    const placaMap: Record<string, { countNoCumple: number; totalInspecciones: number; noAptoCount: number; ultimoCD: string; ultimoConductor: string }> = {};

    filteredChecklists.forEach((chk) => {
      if (!placaMap[chk.placa]) {
        placaMap[chk.placa] = {
          countNoCumple: 0,
          totalInspecciones: 0,
          noAptoCount: 0,
          ultimoCD: chk.centroDistribucion,
          ultimoConductor: chk.conductorNombre,
        };
      }
      placaMap[chk.placa].totalInspecciones++;
      placaMap[chk.placa].countNoCumple += chk.totalNoCumple;
      if (chk.estadoFinal === 'NO APTO') {
        placaMap[chk.placa].noAptoCount++;
      }
    });

    return Object.entries(placaMap)
      .map(([placa, data]) => ({ placa, ...data }))
      .filter((p) => p.countNoCumple > 0 || p.noAptoCount > 0)
      .sort((a, b) => b.noAptoCount - a.noAptoCount || b.countNoCumple - a.countNoCumple);
  }, [filteredChecklists]);

  // Checklists by CD
  const countsByCD = useMemo(() => {
    const cdMap: Record<string, number> = {};
    filteredChecklists.forEach((chk) => {
      cdMap[chk.centroDistribucion] = (cdMap[chk.centroDistribucion] || 0) + 1;
    });
    return Object.entries(cdMap)
      .map(([cd, count]) => ({ cd, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredChecklists]);

  // Checklists by Date
  const countsByDate = useMemo(() => {
    const dateMap: Record<string, number> = {};
    filteredChecklists.forEach((chk) => {
      const day = chk.fechaHora.slice(0, 10);
      dateMap[day] = (dateMap[day] || 0) + 1;
    });
    return Object.entries(dateMap)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(-7);
  }, [filteredChecklists]);

  const handleResetFilters = () => {
    setFilterRegional('TODAS');
    setFilterCD('TODOS');
    setFilterTipo('TODOS');
    setFilterEstado('TODOS');
    setFilterSearch('');
    setFilterFecha('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* Top Banner and Export Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Torre de Control • Patio BU COL
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Logística Conectamos MAZ
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            Dashboard & Bitácora de Contingencia
          </h1>
          <p className="text-xs text-slate-400">
            Monitoreo en tiempo real de inspecciones preoperacionales de camiones.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportChecklistsToExcel(filteredChecklists)}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
            title="Descargar libro de Excel con 1 fila por checklist y 1 columna por ítem"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => exportChecklistsToCSV(filteredChecklists)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
            title="Exportar archivo CSV compatible con Google Sheets y Excel"
          >
            <Download className="w-4 h-4" />
            <span>Google Sheets (CSV)</span>
          </button>

          <button
            onClick={onNewChecklist}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Truck className="w-4 h-4" />
            <span>Nuevo Check List</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Checklists */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
            Check Lists Registrados
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-950">{totalCount}</span>
            <span className="text-xs font-semibold text-slate-500">Patios COL</span>
          </div>
        </div>

        {/* % Aptos */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
            % Flota Apta
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span
              className={`text-2xl sm:text-3xl font-black ${
                pctApto >= 85 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {pctApto}%
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {aptosCount} Aptos
            </span>
          </div>
        </div>

        {/* Vehículos No Aptos */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
            Vehículos NO Aptos
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span
              className={`text-2xl sm:text-3xl font-black ${
                noAptosCount > 0 ? 'text-red-600' : 'text-slate-800'
              }`}
            >
              {noAptosCount}
            </span>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
              Inmovilizados
            </span>
          </div>
        </div>

        {/* Total No Cumple */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
            Total Fallas Reportadas
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-950">{totalFallas}</span>
            <span className="text-xs font-semibold text-slate-500">Hallazgos</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Filtros de Búsqueda</span>
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restablecer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Search Term */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por placa, conductor o cédula..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Regional */}
          <div>
            <select
              value={filterRegional}
              onChange={(e) => {
                setFilterRegional(e.target.value);
                setFilterCD('TODOS');
              }}
              className="w-full py-2 px-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white"
            >
              <option value="TODAS">Regional: Todas</option>
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
              <option value="Centro">Centro</option>
              <option value="Andes">Andes</option>
            </select>
          </div>

          {/* CD */}
          <div>
            <select
              value={filterCD}
              onChange={(e) => setFilterCD(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white"
            >
              <option value="TODOS">CD: Todos</option>
              {availableDCs.map((dc) => (
                <option key={dc} value={dc}>
                  {dc}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white"
            >
              <option value="TODOS">Tipo: Todos</option>
              <option value="Salida">Salida</option>
              <option value="Retorno">Retorno</option>
              <option value="Relevo">Relevo</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white"
            >
              <option value="TODOS">Estado: Todos</option>
              <option value="APROBADO">APROBADO</option>
              <option value="RECHAZADO">RECHAZADO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Section: Top 10 NO CUMPLE + Placas Repetidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 10 Ítems con más NO CUMPLE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Top 10 Ítems con más NO CUMPLE</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Prioridad Taller</span>
          </div>

          {topNoCumpleItems.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center italic">
              No se han registrado fallas con los filtros actuales.
            </p>
          ) : (
            <div className="space-y-2">
              {topNoCumpleItems.map((item, idx) => {
                const maxCount = topNoCumpleItems[0]?.count || 1;
                const barWidth = Math.round((item.count / maxCount) * 100);

                return (
                  <div key={item.id} className="text-xs">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-slate-800 line-clamp-1">
                        {idx + 1}. {item.pregunta}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.esCritico && (
                          <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1 rounded">
                            Crítico
                          </span>
                        )}
                        <span className="font-mono font-bold text-red-600">{item.count}</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.esCritico ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Placas con incumplimientos repetidos */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Placas con Incumplimientos Repetidos</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Alertas de Flota</span>
          </div>

          {placasConIncumplimientos.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center italic">
              No hay placas con fallas recurrentes registradas.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto pr-1">
              {placasConIncumplimientos.map((p) => (
                <div key={p.placa} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-black text-slate-950 text-sm block">
                      {p.placa}
                    </span>
                    <span className="text-slate-500 text-[11px] block">
                      Último reporte: {p.ultimoCD}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                      {p.totalInspecciones} insp.
                    </span>

                    {p.noAptoCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-black text-[11px]">
                        {p.noAptoCount} NO APTO
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                      {p.countNoCumple} fallas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Distribution by CD and by Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Checklists por CD */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Checklists por Centro de Distribución
          </h4>
          <div className="space-y-1.5 text-xs">
            {countsByCD.map((item) => (
              <div key={item.cd} className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="font-medium text-slate-700 truncate">{item.cd}</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Checklists por Día */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Actividad por Día de Inspección
          </h4>
          <div className="space-y-1.5 text-xs">
            {countsByDate.map((item) => (
              <div key={item.day} className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="font-medium text-slate-700">{item.day}</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {item.count} registros
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Checklists Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Bitácora Histórica de Patios
            </h3>
            <p className="text-xs text-slate-500">
              Mostrando {filteredChecklists.length} de {checklists.length} registros
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-3 px-3">Folio</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3">Placa / KM</th>
                <th className="py-3 px-3">Conductor</th>
                <th className="py-3 px-3">CD / Reg.</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-center">Fallas</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChecklists.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No se encontraron registros coincidentes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredChecklists.map((chk) => {
                  const isAprobado = chk.estadoFinal === 'APROBADO' || chk.estadoFinal === 'APTO';
                  const estadoDisplay = isAprobado ? 'APROBADO' : 'RECHAZADO';
                  return (
                    <tr key={chk.id || chk.folio} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {chk.folio || '-'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {chk.fechaAmigable || chk.fechaHora.slice(0, 16).replace('T', ' ')}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900 block">
                          {chk.placa}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {Number(chk.kilometraje).toLocaleString('es-CO')} km
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block truncate max-w-[140px]">
                          {chk.conductorNombre}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          C.C. {chk.conductorCedula}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <span className="block font-medium truncate max-w-[140px]">
                          {chk.centroDistribucion}
                        </span>
                        <span className="text-[10px] text-slate-400">{chk.regional}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{chk.tipo}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider inline-block ${
                            isAprobado
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {estadoDisplay}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold">
                        <span className={chk.totalNoCumple > 0 ? 'text-red-600' : 'text-slate-400'}>
                          {chk.totalNoCumple}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenDetail(chk)}
                            title="Ver Detalle Completo"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onPrintRecord(chk)}
                            title="Imprimir Comprobante"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
