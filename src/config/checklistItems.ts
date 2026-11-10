import { ItemInspeccion, TipoCheckList } from '../types/checklist';

export interface PasoMeta {
  paso: number;
  titulo: string;
  subtitulo: string;
  icono: string;
  categoria: string;
}

export const PASOS_META: Record<number, PasoMeta> = {
  1: {
    paso: 1,
    titulo: 'Información General',
    subtitulo: 'Datos del turno, conductor y vehículo',
    icono: 'Truck',
    categoria: 'General',
  },
  2: {
    paso: 2,
    titulo: 'Condiciones para operar',
    subtitulo: 'Estado del conductor y sistemas neumáticos críticos',
    icono: 'HeartPulse',
    categoria: 'Condiciones para operar',
  },
  3: {
    paso: 3,
    titulo: 'Documentos para operar',
    subtitulo: 'Vigencia de documentación reglamentaria legal',
    icono: 'FileCheck2',
    categoria: 'Documentos para operar',
  },
  4: {
    paso: 4,
    titulo: 'Kit de carretera',
    subtitulo: 'Elementos de seguridad vial, primeros auxilios y emergencia',
    icono: 'ShieldAlert',
    categoria: 'Kit de carretera',
  },
  5: {
    paso: 5,
    titulo: 'Niveles de fluidos',
    subtitulo: 'Inspección de lubricación, refrigeración y estanqueidad',
    icono: 'Droplets',
    categoria: 'Niveles',
  },
  6: {
    paso: 6,
    titulo: 'Llantas',
    subtitulo: 'Estado de banda, labrado y costados de neumáticos',
    icono: 'CircleDot',
    categoria: 'Llantas',
  },
  7: {
    paso: 7,
    titulo: 'Visibilidad y seguridad',
    subtitulo: 'Panorámico, retrovisores, vidrios y cinturones',
    icono: 'Eye',
    categoria: 'Visibilidad y seguridad',
  },
  8: {
    paso: 8,
    titulo: 'Cámaras',
    subtitulo: 'DashCam, cámaras laterales y de reversa',
    icono: 'Video',
    categoria: 'Cámaras',
  },
  9: {
    paso: 9,
    titulo: 'Luces',
    subtitulo: 'Pastas en buen estado y bombillos que encienden',
    icono: 'Lightbulb',
    categoria: 'Luces',
  },
  10: {
    paso: 10,
    titulo: 'Audibles',
    subtitulo: 'Pito principal y alarma acústica de reversa',
    icono: 'Volume2',
    categoria: 'Audibles',
  },
  11: {
    paso: 11,
    titulo: 'Carrocería',
    subtitulo: 'Correas, parales logísticos, cortinas y chapas',
    icono: 'Layers',
    categoria: 'Carrocería',
  },
  12: {
    paso: 12,
    titulo: 'Carretillas de reparto',
    subtitulo: 'Inspección técnica de carretillas #1 y #2',
    icono: 'Boxes',
    categoria: 'Carretillas',
  },
  13: {
    paso: 13,
    titulo: 'Cierre y concepto final',
    subtitulo: 'Declaración del conductor y dictamen de aptitud',
    icono: 'CheckCircle',
    categoria: 'Cierre',
  },
};

export const ITEMS_INSPECCION: ItemInspeccion[] = [
  // PASO 2: Condiciones para operar (Críticos)
  {
    id: 'cond_salud',
    paso: 2,
    categoria: 'Condiciones para operar',
    pregunta: 'Mi estado de salud y descanso es adecuado para conducir',
    codigoCorto: 'cond_salud',
    esCritico: true,
  },
  {
    id: 'cond_sustancias',
    paso: 2,
    categoria: 'Condiciones para operar',
    pregunta: 'Estoy libre de medicamentos, drogas o alcohol que afecten mi desempeño',
    codigoCorto: 'cond_sustancias',
    esCritico: true,
  },
  {
    id: 'cond_aire_fugas',
    paso: 2,
    categoria: 'Condiciones para operar',
    pregunta: 'Sistema de aire sin fugas',
    codigoCorto: 'cond_aire_fugas',
    esCritico: true,
  },
  {
    id: 'cond_tablero_presion',
    paso: 2,
    categoria: 'Condiciones para operar',
    pregunta: 'Tablero sin testigos de presión de aire encendidos',
    codigoCorto: 'cond_tablero_presion',
    esCritico: true,
  },
  {
    id: 'cond_freno_parqueo',
    paso: 2,
    categoria: 'Condiciones para operar',
    pregunta: 'Freno de parqueo funciona adecuadamente',
    codigoCorto: 'cond_freno_parqueo',
    esCritico: true,
  },
  {
    id: 'cond_kit_reparto',
    paso: 2,
    categoria: 'Condiciones para operar',
    pregunta: 'Kit de reparto en buen estado',
    codigoCorto: 'cond_kit_reparto',
    esCritico: true,
  },
  {
    id: 'cond_prod_inventario',
    paso: 2,
    categoria: 'Condiciones para operar',
    pregunta: 'El producto cargado concuerda con el inventario del camión',
    codigoCorto: 'cond_prod_inventario',
    esCritico: true,
    soloTipo: ['Salida'],
  },
  {
    id: 'cond_capacidad_carga',
    paso: 2,
    categoria: 'Condiciones para operar',
    pregunta: 'La carga no supera la capacidad indicada en el documento de transporte',
    codigoCorto: 'cond_capacidad_carga',
    esCritico: true,
    soloTipo: ['Salida'],
  },

  // PASO 3: Documentos para operar (Críticos)
  {
    id: 'doc_licencia',
    paso: 3,
    categoria: 'Documentos para operar',
    pregunta: 'Licencia de conducción vigente y apta para este vehículo',
    codigoCorto: 'doc_licencia',
    esCritico: true,
  },
  {
    id: 'doc_tarjeta_propiedad',
    paso: 3,
    categoria: 'Documentos para operar',
    pregunta: 'Tarjeta de propiedad original',
    codigoCorto: 'doc_propiedad',
    esCritico: true,
  },
  {
    id: 'doc_tecnomecanica',
    paso: 3,
    categoria: 'Documentos para operar',
    pregunta: 'Revisión técnico-mecánica vigente',
    codigoCorto: 'doc_tecnomec',
    esCritico: true,
  },
  {
    id: 'doc_soat',
    paso: 3,
    categoria: 'Documentos para operar',
    pregunta: 'SOAT vigente',
    codigoCorto: 'doc_soat',
    esCritico: true,
  },

  // PASO 4: Kit de carretera
  {
    id: 'kit_gato_llanta',
    paso: 4,
    categoria: 'Kit de carretera',
    pregunta: 'Gato, copa para tuercas, palanca, tacos, conos y llanta de repuesto en buen estado',
    codigoCorto: 'kit_gato_repuesto',
  },
  {
    id: 'kit_extintor_carga',
    paso: 4,
    categoria: 'Kit de carretera',
    pregunta: 'Extintor ≥10 lb cargado, asegurado y con accesorios completos (boquilla, manómetro, pin de seguridad)',
    codigoCorto: 'kit_extintor_10lb',
  },
  {
    id: 'kit_extintores_vigentes',
    paso: 4,
    categoria: 'Kit de carretera',
    pregunta: 'Extintores vigentes',
    codigoCorto: 'kit_extintores_vig',
  },
  {
    id: 'kit_botiquin',
    paso: 4,
    categoria: 'Kit de carretera',
    pregunta: 'Botiquín completo según estándar de primeros auxilios',
    codigoCorto: 'kit_botiquin',
  },
  {
    id: 'kit_linterna',
    paso: 4,
    categoria: 'Kit de carretera',
    pregunta: 'Linterna en buen estado (enciende)',
    codigoCorto: 'kit_linterna',
  },
  {
    id: 'kit_herramientas',
    paso: 4,
    categoria: 'Kit de carretera',
    pregunta: 'Kit básico de herramienta (alicate, destornilladores pala y estrella, llave de expansión y llaves fijas)',
    codigoCorto: 'kit_herramientas',
  },

  // PASO 5: Niveles
  {
    id: 'niv_combustible',
    paso: 5,
    categoria: 'Niveles',
    pregunta: 'Combustible suficiente para operar (o ir a estación de servicio)',
    codigoCorto: 'niv_combustible',
    soloTipo: ['Salida', 'Relevo'],
  },
  {
    id: 'niv_liq_embrague',
    paso: 5,
    categoria: 'Niveles',
    pregunta: 'Líquido de embrague sin fugas',
    codigoCorto: 'niv_embrague',
    permiteNA: true,
  },
  {
    id: 'niv_refrigerante',
    paso: 5,
    categoria: 'Niveles',
    pregunta: 'Refrigerante sin fugas',
    codigoCorto: 'niv_refrig',
  },
  {
    id: 'niv_aceite_motor',
    paso: 5,
    categoria: 'Niveles',
    pregunta: 'Aceite de motor sin fugas',
    codigoCorto: 'niv_motor',
  },
  {
    id: 'niv_hidraulico_dir',
    paso: 5,
    categoria: 'Niveles',
    pregunta: 'Hidráulico de dirección sin fugas',
    codigoCorto: 'niv_hidraulico',
  },
  {
    id: 'niv_aceite_caja_dif',
    paso: 5,
    categoria: 'Niveles',
    pregunta: 'Aceite de caja y diferencial sin fugas',
    codigoCorto: 'niv_caja_dif',
  },
  {
    id: 'niv_agua_parabrisas',
    paso: 5,
    categoria: 'Niveles',
    pregunta: 'Depósito de agua del parabrisas sin fugas',
    codigoCorto: 'niv_parabrisas',
  },

  // PASO 6: Llantas (Críticos)
  {
    id: 'llant_labrado',
    paso: 6,
    categoria: 'Llantas',
    pregunta: 'Labrado mayor a 3 mm de profundidad',
    codigoCorto: 'llant_labrado_3mm',
    esCritico: true,
  },
  {
    id: 'llant_costados',
    paso: 6,
    categoria: 'Llantas',
    pregunta: 'Costados sin deformaciones',
    codigoCorto: 'llant_sin_deformac',
    esCritico: true,
  },
  {
    id: 'llant_bandas_rodamiento',
    paso: 6,
    categoria: 'Llantas',
    pregunta: 'Bandas de rodamiento sin desprendimientos ni desgarres',
    codigoCorto: 'llant_bandas_ok',
    esCritico: true,
  },

  // PASO 7: Visibilidad y seguridad
  {
    id: 'vis_panoramico',
    paso: 7,
    categoria: 'Visibilidad y seguridad',
    pregunta: 'Panorámico con buena visibilidad, sin fisuras ni objetos no autorizados (cintas, adornos, muñecos)',
    codigoCorto: 'vis_panoramico',
  },
  {
    id: 'vis_retrovisores',
    paso: 7,
    categoria: 'Visibilidad y seguridad',
    pregunta: 'Retrovisores completos, sin fisuras y con bases/soportes en buen estado',
    codigoCorto: 'vis_retrovisores',
  },
  {
    id: 'vis_limpiaparabrisas',
    paso: 7,
    categoria: 'Visibilidad y seguridad',
    pregunta: 'Limpiaparabrisas y plumillas en buen estado',
    codigoCorto: 'vis_limpiaparabrisas',
  },
  {
    id: 'vis_cinturones',
    paso: 7,
    categoria: 'Visibilidad y seguridad',
    pregunta: 'Cinturones completos, retraen, riatas y recibidor en buen estado',
    codigoCorto: 'vis_cinturones',
    esCritico: true, // Specifically required for "Vehículo NO apto"
  },
  {
    id: 'vis_calapies',
    paso: 7,
    categoria: 'Visibilidad y seguridad',
    pregunta: 'Vehículo cuenta con calapiés',
    codigoCorto: 'vis_calapies',
  },
  {
    id: 'vis_cierre_llave',
    paso: 7,
    categoria: 'Visibilidad y seguridad',
    pregunta: 'Vehículo se puede cerrar con llave desde afuera',
    codigoCorto: 'vis_cierre_llave',
  },
  {
    id: 'vis_vidrios_cabina',
    paso: 7,
    categoria: 'Visibilidad y seguridad',
    pregunta: 'Vidrios de cabina con buena visibilidad, sin fisuras',
    codigoCorto: 'vis_vidrios_cabina',
  },

  // PASO 8: Cámaras
  {
    id: 'cam_dashcam',
    paso: 8,
    categoria: 'Cámaras',
    pregunta: 'DashCam en buen estado y en posición correcta',
    codigoCorto: 'cam_dashcam',
  },
  {
    id: 'cam_laterales',
    paso: 8,
    categoria: 'Cámaras',
    pregunta: 'Cámaras laterales en posición correcta',
    codigoCorto: 'cam_laterales',
  },
  {
    id: 'cam_reversa',
    paso: 8,
    categoria: 'Cámaras',
    pregunta: 'Cámara de reversa funcionando',
    codigoCorto: 'cam_reversa',
  },

  // PASO 9: Luces
  {
    id: 'luc_freno',
    paso: 9,
    categoria: 'Luces',
    pregunta: 'Luces de freno',
    codigoCorto: 'luc_freno',
    esCritico: true, // Specifically required for "Vehículo NO apto"
  },
  {
    id: 'luc_principales',
    paso: 9,
    categoria: 'Luces',
    pregunta: 'Luces principales (alta/baja)',
    codigoCorto: 'luc_principales',
  },
  {
    id: 'luc_reversa',
    paso: 9,
    categoria: 'Luces',
    pregunta: 'Luces de reversa',
    codigoCorto: 'luc_reversa',
  },
  {
    id: 'luc_direccionales',
    paso: 9,
    categoria: 'Luces',
    pregunta: 'Direccionales delanteras, traseras y laterales',
    codigoCorto: 'luc_direccionales',
  },
  {
    id: 'luc_estacionarias',
    paso: 9,
    categoria: 'Luces',
    pregunta: 'Luces estacionarias',
    codigoCorto: 'luc_estacionarias',
  },
  {
    id: 'luc_cocuyos',
    paso: 9,
    categoria: 'Luces',
    pregunta: 'Cocuyos laterales',
    codigoCorto: 'luc_cocuyos',
  },

  // PASO 10: Audibles
  {
    id: 'aud_pito_principal',
    paso: 10,
    categoria: 'Audibles',
    pregunta: 'Pito principal operando',
    codigoCorto: 'aud_pito_principal',
  },
  {
    id: 'aud_pito_reversa',
    paso: 10,
    categoria: 'Audibles',
    pregunta: 'Pito de reversa suena al engranar reversa',
    codigoCorto: 'aud_pito_reversa',
  },

  // PASO 11: Carrocería
  {
    id: 'carr_correas',
    paso: 11,
    categoria: 'Carrocería',
    pregunta: 'Correas de amarre completas y en buen estado',
    codigoCorto: 'carr_correas',
  },
  {
    id: 'carr_parales',
    paso: 11,
    categoria: 'Carrocería',
    pregunta: 'Parales logísticos se mantienen en las guías',
    codigoCorto: 'carr_parales',
  },
  {
    id: 'carr_cortinas',
    paso: 11,
    categoria: 'Carrocería',
    pregunta: 'Cortinas sin desgarres mayores a 1 m, abren y cierran sin dificultad',
    codigoCorto: 'carr_cortinas',
  },
  {
    id: 'carr_chapas',
    paso: 11,
    categoria: 'Carrocería',
    pregunta: 'Chapas de cortinas cierran correctamente y no se abren solas',
    codigoCorto: 'carr_chapas',
  },
];

/**
 * Filter items by step and checklist type
 */
export function getItemsPorPaso(paso: number, tipo: TipoCheckList): ItemInspeccion[] {
  return ITEMS_INSPECCION.filter((item) => {
    if (item.paso !== paso) return false;
    if (item.soloTipo && !item.soloTipo.includes(tipo)) return false;
    return true;
  });
}

/**
 * Determines whether a checklist fails critical safety rules.
 * Rule: si hay algún NO CUMPLE en:
 * - Condiciones para operar (paso 2)
 * - Documentos (paso 3)
 * - Llantas (paso 6)
 * - Luces de freno (id: 'luc_freno')
 * - Cinturones (id: 'vis_cinturones')
 */
export function evaluarAptitudSugerida(
  respuestas: Record<string, { estado: string }>,
  conductorCondiciones: boolean,
  vehiculoCondiciones: boolean
): { esApto: boolean; fallasCriticas: string[]; totalNoCumple: number } {
  const fallasCriticas: string[] = [];
  let totalNoCumple = 0;

  // Check driver declaration
  if (conductorCondiciones === false) {
    fallasCriticas.push('Conductor declaró no estar en condiciones para operar');
  }
  if (vehiculoCondiciones === false) {
    fallasCriticas.push('Conductor declaró que el vehículo no está en condiciones para operar');
  }

  // Iterate over inspected items
  ITEMS_INSPECCION.forEach((item) => {
    const resp = respuestas[item.id];
    if (resp?.estado === 'NO CUMPLE') {
      totalNoCumple++;
      if (item.esCritico) {
        fallasCriticas.push(`[${item.categoria}] ${item.pregunta}`);
      }
    }
  });

  const esApto = fallasCriticas.length === 0;
  return {
    esApto,
    fallasCriticas,
    totalNoCumple,
  };
}
