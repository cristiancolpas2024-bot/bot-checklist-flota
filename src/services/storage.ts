import * as XLSX from 'xlsx';
import { ITEMS_INSPECCION } from '../config/checklistItems';
import { ChecklistData, EstadoGeneral } from '../types/checklist';

const STORAGE_KEY_CHECKLISTS = 'maz_bu_col_checklists_v1';

// Seed sample records for immediate rich dashboard visualization
const SEED_DATA: ChecklistData[] = [
  {
    id: 'seed-01',
    folio: 'CKL-COL-00101',
    fechaHora: '2026-11-09T05:30:00.000Z',
    fechaAmigable: '09/11/2026 05:30 AM',
    regional: 'Norte',
    centroDistribucion: 'DC La Arenosa',
    tipo: 'Salida',
    conductorNombre: 'Carlos Julio Mendoza',
    conductorCedula: '72189452',
    placa: 'WRO452',
    kilometraje: 148200,
    respuestas: {
      cond_salud: { estado: 'CUMPLE' },
      cond_sustancias: { estado: 'CUMPLE' },
      cond_aire_fugas: { estado: 'CUMPLE' },
      cond_tablero_presion: { estado: 'CUMPLE' },
      cond_freno_parqueo: { estado: 'CUMPLE' },
      cond_kit_reparto: { estado: 'CUMPLE' },
      cond_prod_inventario: { estado: 'CUMPLE' },
      cond_capacidad_carga: { estado: 'CUMPLE' },
      doc_licencia: { estado: 'CUMPLE' },
      doc_tarjeta_propiedad: { estado: 'CUMPLE' },
      doc_tecnomecanica: { estado: 'CUMPLE' },
      doc_soat: { estado: 'CUMPLE' },
      kit_gato_llanta: { estado: 'CUMPLE' },
      kit_extintor_carga: { estado: 'CUMPLE' },
      kit_extintores_vigentes: { estado: 'CUMPLE' },
      kit_botiquin: { estado: 'CUMPLE' },
      kit_linterna: { estado: 'CUMPLE' },
      kit_herramientas: { estado: 'CUMPLE' },
      niv_combustible: { estado: 'CUMPLE' },
      niv_liq_embrague: { estado: 'CUMPLE' },
      niv_refrigerante: { estado: 'CUMPLE' },
      niv_aceite_motor: { estado: 'CUMPLE' },
      niv_hidraulico_dir: { estado: 'CUMPLE' },
      niv_aceite_caja_dif: { estado: 'CUMPLE' },
      niv_agua_parabrisas: { estado: 'CUMPLE' },
      llant_labrado: { estado: 'CUMPLE' },
      llant_costados: { estado: 'CUMPLE' },
      llant_bandas_rodamiento: { estado: 'CUMPLE' },
      vis_panoramico: { estado: 'CUMPLE' },
      vis_retrovisores: { estado: 'CUMPLE' },
      vis_limpiaparabrisas: { estado: 'CUMPLE' },
      vis_cinturones: { estado: 'CUMPLE' },
      vis_calapies: { estado: 'CUMPLE' },
      vis_cierre_llave: { estado: 'CUMPLE' },
      vis_vidrios_cabina: { estado: 'CUMPLE' },
      cam_dashcam: { estado: 'CUMPLE' },
      cam_laterales: { estado: 'CUMPLE' },
      cam_reversa: { estado: 'CUMPLE' },
      luc_freno: { estado: 'CUMPLE' },
      luc_principales: { estado: 'CUMPLE' },
      luc_reversa: { estado: 'CUMPLE' },
      luc_direccionales: { estado: 'CUMPLE' },
      luc_estacionarias: { estado: 'CUMPLE' },
      luc_cocuyos: { estado: 'CUMPLE' },
      aud_pito_principal: { estado: 'CUMPLE' },
      aud_pito_reversa: { estado: 'CUMPLE' },
      carr_correas: { estado: 'CUMPLE' },
      carr_parales: { estado: 'CUMPLE' },
      carr_cortinas: { estado: 'CUMPLE' },
      carr_chapas: { estado: 'CUMPLE' },
    },
    carretilla1: {
      cuentaConCarretilla: true,
      buenEstadoGeneral: 'CUMPLE',
      llantasRodamientos: 'CUMPLE',
      etiquetaCoherente: 'CUMPLE',
    },
    carretilla2: {
      cuentaConCarretilla: true,
      buenEstadoGeneral: 'CUMPLE',
      llantasRodamientos: 'CUMPLE',
      etiquetaCoherente: 'CUMPLE',
    },
    conductorCondiciones: true,
    vehiculoCondiciones: true,
    sugeridoSistema: 'APTO',
    estadoFinal: 'APTO',
    totalNoCumple: 0,
    observacionesGenerales: 'Ruta Troncal Norte sin novedades.',
    firmaConductor: true,
  },
  {
    id: 'seed-02',
    folio: 'CKL-COL-00102',
    fechaHora: '2026-11-09T06:15:00.000Z',
    fechaAmigable: '09/11/2026 06:15 AM',
    regional: 'Norte',
    centroDistribucion: 'DC Galapa',
    tipo: 'Salida',
    conductorNombre: 'Jader Antonio Barraza',
    conductorCedula: '85493210',
    placa: 'SOK789',
    kilometraje: 98450,
    respuestas: {
      cond_salud: { estado: 'CUMPLE' },
      cond_sustancias: { estado: 'CUMPLE' },
      cond_aire_fugas: { estado: 'CUMPLE' },
      cond_tablero_presion: { estado: 'CUMPLE' },
      cond_freno_parqueo: { estado: 'CUMPLE' },
      cond_kit_reparto: { estado: 'CUMPLE' },
      cond_prod_inventario: { estado: 'CUMPLE' },
      cond_capacidad_carga: { estado: 'CUMPLE' },
      doc_licencia: { estado: 'CUMPLE' },
      doc_tarjeta_propiedad: { estado: 'CUMPLE' },
      doc_tecnomecanica: { estado: 'CUMPLE' },
      doc_soat: { estado: 'CUMPLE' },
      kit_gato_llanta: { estado: 'CUMPLE' },
      kit_extintor_carga: { estado: 'CUMPLE' },
      kit_extintores_vigentes: { estado: 'CUMPLE' },
      kit_botiquin: { estado: 'CUMPLE' },
      kit_linterna: { estado: 'NO CUMPLE', comentario: 'Pilas sulfatadas en linterna' },
      kit_herramientas: { estado: 'CUMPLE' },
      niv_combustible: { estado: 'CUMPLE' },
      niv_liq_embrague: { estado: 'CUMPLE' },
      niv_refrigerante: { estado: 'CUMPLE' },
      niv_aceite_motor: { estado: 'CUMPLE' },
      niv_hidraulico_dir: { estado: 'CUMPLE' },
      niv_aceite_caja_dif: { estado: 'CUMPLE' },
      niv_agua_parabrisas: { estado: 'NO CUMPLE', comentario: 'Depósito sin agua' },
      llant_labrado: { estado: 'CUMPLE' },
      llant_costados: { estado: 'CUMPLE' },
      llant_bandas_rodamiento: { estado: 'CUMPLE' },
      vis_panoramico: { estado: 'CUMPLE' },
      vis_retrovisores: { estado: 'CUMPLE' },
      vis_limpiaparabrisas: { estado: 'CUMPLE' },
      vis_cinturones: { estado: 'CUMPLE' },
      vis_calapies: { estado: 'CUMPLE' },
      vis_cierre_llave: { estado: 'CUMPLE' },
      vis_vidrios_cabina: { estado: 'CUMPLE' },
      cam_dashcam: { estado: 'CUMPLE' },
      cam_laterales: { estado: 'CUMPLE' },
      cam_reversa: { estado: 'CUMPLE' },
      luc_freno: { estado: 'CUMPLE' },
      luc_principales: { estado: 'CUMPLE' },
      luc_reversa: { estado: 'CUMPLE' },
      luc_direccionales: { estado: 'CUMPLE' },
      luc_estacionarias: { estado: 'CUMPLE' },
      luc_cocuyos: { estado: 'NO CUMPLE', comentario: 'Cocuyo derecho no prende' },
      aud_pito_principal: { estado: 'CUMPLE' },
      aud_pito_reversa: { estado: 'CUMPLE' },
      carr_correas: { estado: 'CUMPLE' },
      carr_parales: { estado: 'CUMPLE' },
      carr_cortinas: { estado: 'CUMPLE' },
      carr_chapas: { estado: 'CUMPLE' },
    },
    carretilla1: {
      cuentaConCarretilla: true,
      buenEstadoGeneral: 'CUMPLE',
      llantasRodamientos: 'CUMPLE',
      etiquetaCoherente: 'CUMPLE',
    },
    carretilla2: { cuentaConCarretilla: false },
    conductorCondiciones: true,
    vehiculoCondiciones: true,
    sugeridoSistema: 'APTO',
    estadoFinal: 'APTO',
    totalNoCumple: 3,
    observacionesGenerales: 'Novedades menores reportadas a taller para turno de noche.',
    firmaConductor: true,
  },
  {
    id: 'seed-03',
    folio: 'CKL-COL-00103',
    fechaHora: '2026-11-09T06:40:00.000Z',
    fechaAmigable: '09/11/2026 06:40 AM',
    regional: 'Centro',
    centroDistribucion: 'DC Bogotá Norte',
    tipo: 'Salida',
    conductorNombre: 'Mauricio Prada Cárdenas',
    conductorCedula: '79841203',
    placa: 'TKR314',
    kilometraje: 215400,
    respuestas: {
      cond_salud: { estado: 'CUMPLE' },
      cond_sustancias: { estado: 'CUMPLE' },
      cond_aire_fugas: { estado: 'NO CUMPLE', comentario: 'Fuga de aire visible en manguera de pulmón trasero' },
      cond_tablero_presion: { estado: 'NO CUMPLE', comentario: 'Testigo rojo de baja presión activo' },
      cond_freno_parqueo: { estado: 'CUMPLE' },
      cond_kit_reparto: { estado: 'CUMPLE' },
      cond_prod_inventario: { estado: 'CUMPLE' },
      cond_capacidad_carga: { estado: 'CUMPLE' },
      doc_licencia: { estado: 'CUMPLE' },
      doc_tarjeta_propiedad: { estado: 'CUMPLE' },
      doc_tecnomecanica: { estado: 'CUMPLE' },
      doc_soat: { estado: 'CUMPLE' },
      kit_gato_llanta: { estado: 'CUMPLE' },
      kit_extintor_carga: { estado: 'CUMPLE' },
      kit_extintores_vigentes: { estado: 'CUMPLE' },
      kit_botiquin: { estado: 'CUMPLE' },
      kit_linterna: { estado: 'CUMPLE' },
      kit_herramientas: { estado: 'CUMPLE' },
      niv_combustible: { estado: 'CUMPLE' },
      niv_liq_embrague: { estado: 'CUMPLE' },
      niv_refrigerante: { estado: 'CUMPLE' },
      niv_aceite_motor: { estado: 'CUMPLE' },
      niv_hidraulico_dir: { estado: 'CUMPLE' },
      niv_aceite_caja_dif: { estado: 'CUMPLE' },
      niv_agua_parabrisas: { estado: 'CUMPLE' },
      llant_labrado: { estado: 'CUMPLE' },
      llant_costados: { estado: 'CUMPLE' },
      llant_bandas_rodamiento: { estado: 'CUMPLE' },
      vis_panoramico: { estado: 'CUMPLE' },
      vis_retrovisores: { estado: 'CUMPLE' },
      vis_limpiaparabrisas: { estado: 'CUMPLE' },
      vis_cinturones: { estado: 'CUMPLE' },
      vis_calapies: { estado: 'CUMPLE' },
      vis_cierre_llave: { estado: 'CUMPLE' },
      vis_vidrios_cabina: { estado: 'CUMPLE' },
      cam_dashcam: { estado: 'CUMPLE' },
      cam_laterales: { estado: 'CUMPLE' },
      cam_reversa: { estado: 'CUMPLE' },
      luc_freno: { estado: 'NO CUMPLE', comentario: 'Bombillo freno izquierdo fundido' },
      luc_principales: { estado: 'CUMPLE' },
      luc_reversa: { estado: 'CUMPLE' },
      luc_direccionales: { estado: 'CUMPLE' },
      luc_estacionarias: { estado: 'CUMPLE' },
      luc_cocuyos: { estado: 'CUMPLE' },
      aud_pito_principal: { estado: 'CUMPLE' },
      aud_pito_reversa: { estado: 'CUMPLE' },
      carr_correas: { estado: 'CUMPLE' },
      carr_parales: { estado: 'CUMPLE' },
      carr_cortinas: { estado: 'CUMPLE' },
      carr_chapas: { estado: 'CUMPLE' },
    },
    carretilla1: {
      cuentaConCarretilla: true,
      buenEstadoGeneral: 'CUMPLE',
      llantasRodamientos: 'CUMPLE',
      etiquetaCoherente: 'CUMPLE',
    },
    carretilla2: { cuentaConCarretilla: false },
    conductorCondiciones: true,
    vehiculoCondiciones: false,
    sugeridoSistema: 'NO APTO',
    estadoFinal: 'NO APTO',
    totalNoCumple: 3,
    observacionesGenerales: 'Camión inmovilizado en bahía 4 para revisión de frenos y aire.',
    firmaConductor: true,
  },
  {
    id: 'seed-04',
    folio: 'CKL-COL-00104',
    fechaHora: '2026-11-08T14:20:00.000Z',
    fechaAmigable: '08/11/2026 02:20 PM',
    regional: 'Sur',
    centroDistribucion: 'DC Cali',
    tipo: 'Retorno',
    conductorNombre: 'Hernando Caicedo Mina',
    conductorCedula: '94251034',
    placa: 'WRO452',
    kilometraje: 148380,
    respuestas: {
      cond_salud: { estado: 'CUMPLE' },
      cond_sustancias: { estado: 'CUMPLE' },
      cond_aire_fugas: { estado: 'CUMPLE' },
      cond_tablero_presion: { estado: 'CUMPLE' },
      cond_freno_parqueo: { estado: 'CUMPLE' },
      cond_kit_reparto: { estado: 'CUMPLE' },
      doc_licencia: { estado: 'CUMPLE' },
      doc_tarjeta_propiedad: { estado: 'CUMPLE' },
      doc_tecnomecanica: { estado: 'CUMPLE' },
      doc_soat: { estado: 'CUMPLE' },
      kit_gato_llanta: { estado: 'CUMPLE' },
      kit_extintor_carga: { estado: 'CUMPLE' },
      kit_extintores_vigentes: { estado: 'CUMPLE' },
      kit_botiquin: { estado: 'CUMPLE' },
      kit_linterna: { estado: 'CUMPLE' },
      kit_herramientas: { estado: 'CUMPLE' },
      niv_liq_embrague: { estado: 'CUMPLE' },
      niv_refrigerante: { estado: 'CUMPLE' },
      niv_aceite_motor: { estado: 'CUMPLE' },
      niv_hidraulico_dir: { estado: 'CUMPLE' },
      niv_aceite_caja_dif: { estado: 'CUMPLE' },
      niv_agua_parabrisas: { estado: 'CUMPLE' },
      llant_labrado: { estado: 'CUMPLE' },
      llant_costados: { estado: 'CUMPLE' },
      llant_bandas_rodamiento: { estado: 'CUMPLE' },
      vis_panoramico: { estado: 'CUMPLE' },
      vis_retrovisores: { estado: 'CUMPLE' },
      vis_limpiaparabrisas: { estado: 'CUMPLE' },
      vis_cinturones: { estado: 'CUMPLE' },
      vis_calapies: { estado: 'CUMPLE' },
      vis_cierre_llave: { estado: 'CUMPLE' },
      vis_vidrios_cabina: { estado: 'CUMPLE' },
      cam_dashcam: { estado: 'CUMPLE' },
      cam_laterales: { estado: 'CUMPLE' },
      cam_reversa: { estado: 'CUMPLE' },
      luc_freno: { estado: 'CUMPLE' },
      luc_principales: { estado: 'CUMPLE' },
      luc_reversa: { estado: 'CUMPLE' },
      luc_direccionales: { estado: 'CUMPLE' },
      luc_estacionarias: { estado: 'CUMPLE' },
      luc_cocuyos: { estado: 'CUMPLE' },
      aud_pito_principal: { estado: 'CUMPLE' },
      aud_pito_reversa: { estado: 'CUMPLE' },
      carr_correas: { estado: 'CUMPLE' },
      carr_parales: { estado: 'CUMPLE' },
      carr_cortinas: { estado: 'CUMPLE' },
      carr_chapas: { estado: 'CUMPLE' },
    },
    carretilla1: {
      cuentaConCarretilla: true,
      buenEstadoGeneral: 'CUMPLE',
      llantasRodamientos: 'CUMPLE',
      etiquetaCoherente: 'CUMPLE',
    },
    carretilla2: {
      cuentaConCarretilla: true,
      buenEstadoGeneral: 'CUMPLE',
      llantasRodamientos: 'CUMPLE',
      etiquetaCoherente: 'CUMPLE',
    },
    conductorCondiciones: true,
    vehiculoCondiciones: true,
    sugeridoSistema: 'APTO',
    estadoFinal: 'APTO',
    totalNoCumple: 0,
    observacionesGenerales: 'Retorno de ruta sin daños en carrocería ni carretillas.',
    firmaConductor: true,
  },
  {
    id: 'seed-05',
    folio: 'CKL-COL-00105',
    fechaHora: '2026-11-08T18:00:00.000Z',
    fechaAmigable: '08/11/2026 06:00 PM',
    regional: 'Andes',
    centroDistribucion: 'DC Medellín (Itagüí)',
    tipo: 'Relevo',
    conductorNombre: 'Gustavo Adolfo Urrego',
    conductorCedula: '98563214',
    placa: 'TKR314',
    kilometraje: 215560,
    respuestas: {
      cond_salud: { estado: 'CUMPLE' },
      cond_sustancias: { estado: 'CUMPLE' },
      cond_aire_fugas: { estado: 'CUMPLE' },
      cond_tablero_presion: { estado: 'CUMPLE' },
      cond_freno_parqueo: { estado: 'CUMPLE' },
      cond_kit_reparto: { estado: 'CUMPLE' },
      doc_licencia: { estado: 'CUMPLE' },
      doc_tarjeta_propiedad: { estado: 'CUMPLE' },
      doc_tecnomecanica: { estado: 'CUMPLE' },
      doc_soat: { estado: 'CUMPLE' },
      kit_gato_llanta: { estado: 'CUMPLE' },
      kit_extintor_carga: { estado: 'CUMPLE' },
      kit_extintores_vigentes: { estado: 'CUMPLE' },
      kit_botiquin: { estado: 'CUMPLE' },
      kit_linterna: { estado: 'CUMPLE' },
      kit_herramientas: { estado: 'CUMPLE' },
      niv_combustible: { estado: 'CUMPLE' },
      niv_liq_embrague: { estado: 'CUMPLE' },
      niv_refrigerante: { estado: 'CUMPLE' },
      niv_aceite_motor: { estado: 'CUMPLE' },
      niv_hidraulico_dir: { estado: 'CUMPLE' },
      niv_aceite_caja_dif: { estado: 'CUMPLE' },
      niv_agua_parabrisas: { estado: 'CUMPLE' },
      llant_labrado: { estado: 'NO CUMPLE', comentario: 'Llanta trasera interna con labrado menor a 2mm' },
      llant_costados: { estado: 'CUMPLE' },
      llant_bandas_rodamiento: { estado: 'CUMPLE' },
      vis_panoramico: { estado: 'CUMPLE' },
      vis_retrovisores: { estado: 'CUMPLE' },
      vis_limpiaparabrisas: { estado: 'CUMPLE' },
      vis_cinturones: { estado: 'CUMPLE' },
      vis_calapies: { estado: 'CUMPLE' },
      vis_cierre_llave: { estado: 'CUMPLE' },
      vis_vidrios_cabina: { estado: 'CUMPLE' },
      cam_dashcam: { estado: 'CUMPLE' },
      cam_laterales: { estado: 'CUMPLE' },
      cam_reversa: { estado: 'CUMPLE' },
      luc_freno: { estado: 'CUMPLE' },
      luc_principales: { estado: 'CUMPLE' },
      luc_reversa: { estado: 'CUMPLE' },
      luc_direccionales: { estado: 'CUMPLE' },
      luc_estacionarias: { estado: 'CUMPLE' },
      luc_cocuyos: { estado: 'CUMPLE' },
      aud_pito_principal: { estado: 'CUMPLE' },
      aud_pito_reversa: { estado: 'CUMPLE' },
      carr_correas: { estado: 'CUMPLE' },
      carr_parales: { estado: 'CUMPLE' },
      carr_cortinas: { estado: 'CUMPLE' },
      carr_chapas: { estado: 'CUMPLE' },
    },
    carretilla1: {
      cuentaConCarretilla: true,
      buenEstadoGeneral: 'CUMPLE',
      llantasRodamientos: 'CUMPLE',
      etiquetaCoherente: 'CUMPLE',
    },
    carretilla2: { cuentaConCarretilla: false },
    conductorCondiciones: true,
    vehiculoCondiciones: false,
    sugeridoSistema: 'NO APTO',
    estadoFinal: 'NO APTO',
    totalNoCumple: 1,
    observacionesGenerales: 'Reemplazo urgente de neumático antes de relevo.',
    firmaConductor: true,
  },
  {
    id: 'seed-06',
    folio: 'CKL-COL-00106',
    fechaHora: '2026-11-07T05:45:00.000Z',
    fechaAmigable: '07/11/2026 05:45 AM',
    regional: 'Norte',
    centroDistribucion: 'DC Santa Marta',
    tipo: 'Salida',
    conductorNombre: 'Edgardo José Polo',
    conductorCedula: '77123984',
    placa: 'TKR314',
    kilometraje: 215100,
    respuestas: {
      cond_salud: { estado: 'CUMPLE' },
      cond_sustancias: { estado: 'CUMPLE' },
      cond_aire_fugas: { estado: 'CUMPLE' },
      cond_tablero_presion: { estado: 'CUMPLE' },
      cond_freno_parqueo: { estado: 'CUMPLE' },
      cond_kit_reparto: { estado: 'CUMPLE' },
      cond_prod_inventario: { estado: 'CUMPLE' },
      cond_capacidad_carga: { estado: 'CUMPLE' },
      doc_licencia: { estado: 'CUMPLE' },
      doc_tarjeta_propiedad: { estado: 'CUMPLE' },
      doc_tecnomecanica: { estado: 'CUMPLE' },
      doc_soat: { estado: 'CUMPLE' },
      kit_gato_llanta: { estado: 'CUMPLE' },
      kit_extintor_carga: { estado: 'CUMPLE' },
      kit_extintores_vigentes: { estado: 'CUMPLE' },
      kit_botiquin: { estado: 'CUMPLE' },
      kit_linterna: { estado: 'CUMPLE' },
      kit_herramientas: { estado: 'CUMPLE' },
      niv_combustible: { estado: 'CUMPLE' },
      niv_liq_embrague: { estado: 'CUMPLE' },
      niv_refrigerante: { estado: 'CUMPLE' },
      niv_aceite_motor: { estado: 'CUMPLE' },
      niv_hidraulico_dir: { estado: 'CUMPLE' },
      niv_aceite_caja_dif: { estado: 'CUMPLE' },
      niv_agua_parabrisas: { estado: 'CUMPLE' },
      llant_labrado: { estado: 'CUMPLE' },
      llant_costados: { estado: 'CUMPLE' },
      llant_bandas_rodamiento: { estado: 'CUMPLE' },
      vis_panoramico: { estado: 'CUMPLE' },
      vis_retrovisores: { estado: 'CUMPLE' },
      vis_limpiaparabrisas: { estado: 'CUMPLE' },
      vis_cinturones: { estado: 'NO CUMPLE', comentario: 'Cinturón copiloto no retrae' },
      vis_calapies: { estado: 'CUMPLE' },
      vis_cierre_llave: { estado: 'CUMPLE' },
      vis_vidrios_cabina: { estado: 'CUMPLE' },
      cam_dashcam: { estado: 'CUMPLE' },
      cam_laterales: { estado: 'CUMPLE' },
      cam_reversa: { estado: 'CUMPLE' },
      luc_freno: { estado: 'CUMPLE' },
      luc_principales: { estado: 'CUMPLE' },
      luc_reversa: { estado: 'CUMPLE' },
      luc_direccionales: { estado: 'CUMPLE' },
      luc_estacionarias: { estado: 'CUMPLE' },
      luc_cocuyos: { estado: 'CUMPLE' },
      aud_pito_principal: { estado: 'CUMPLE' },
      aud_pito_reversa: { estado: 'CUMPLE' },
      carr_correas: { estado: 'CUMPLE' },
      carr_parales: { estado: 'CUMPLE' },
      carr_cortinas: { estado: 'CUMPLE' },
      carr_chapas: { estado: 'CUMPLE' },
    },
    carretilla1: {
      cuentaConCarretilla: true,
      buenEstadoGeneral: 'CUMPLE',
      llantasRodamientos: 'CUMPLE',
      etiquetaCoherente: 'CUMPLE',
    },
    carretilla2: { cuentaConCarretilla: false },
    conductorCondiciones: true,
    vehiculoCondiciones: false,
    sugeridoSistema: 'NO APTO',
    estadoFinal: 'NO APTO',
    totalNoCumple: 1,
    observacionesGenerales: 'Cinturón requiere cambio por personal de taller.',
    firmaConductor: true,
  },
];

export function getStoredChecklists(): ChecklistData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHECKLISTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    }
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : SEED_DATA;
  } catch (e) {
    console.error('Error al obtener checklists:', e);
    return SEED_DATA;
  }
}

export function saveChecklist(data: Omit<ChecklistData, 'id' | 'folio' | 'fechaHora' | 'fechaAmigable'>): ChecklistData {
  const current = getStoredChecklists();
  const nextNum = current.length + 107;
  const now = new Date();

  const fechaAmigable = now.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const newRecord: ChecklistData = {
    ...data,
    id: 'chk-' + Date.now(),
    folio: `CKL-COL-${String(nextNum).padStart(5, '0')}`,
    fechaHora: now.toISOString(),
    fechaAmigable,
  };

  const updated = [newRecord, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error guardando en localStorage:', e);
  }
  return newRecord;
}

export function clearChecklists(): void {
  try {
    localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(SEED_DATA));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Generates an Excel workbook with 1 row per checklist and 1 column per item
 * Short & stable column names for business intelligence and data pipelines.
 */
export function exportChecklistsToExcel(checklists: ChecklistData[]): void {
  // Build main table
  const rows = checklists.map((chk) => {
    const baseRow: Record<string, string | number> = {
      folio: chk.folio || '',
      fecha_hora: chk.fechaHora,
      fecha_local: chk.fechaAmigable || '',
      regional: chk.regional,
      cd: chk.centroDistribucion,
      tipo_checklist: chk.tipo,
      conductor: chk.conductorNombre,
      cedula: chk.conductorCedula,
      placa: chk.placa,
      km: chk.kilometraje,
      conductor_apto: chk.conductorCondiciones ? 'SI' : 'NO',
      vehiculo_apto: chk.vehiculoCondiciones ? 'SI' : 'NO',
      estado_general: chk.estadoFinal,
      total_no_cumple: chk.totalNoCumple,
    };

    // Columns for all inspection items
    ITEMS_INSPECCION.forEach((item) => {
      const resp = chk.respuestas[item.id];
      const val = resp?.estado || 'N/A';
      baseRow[item.codigoCorto] = resp?.comentario ? `${val} (${resp.comentario})` : val;
    });

    // Carretillas
    baseRow['carr1_posee'] = chk.carretilla1?.cuentaConCarretilla ? 'SI' : 'NO';
    baseRow['carr1_estado'] = chk.carretilla1?.buenEstadoGeneral || 'N/A';
    baseRow['carr1_llantas'] = chk.carretilla1?.llantasRodamientos || 'N/A';
    baseRow['carr1_etiqueta'] = chk.carretilla1?.etiquetaCoherente || 'N/A';

    baseRow['carr2_posee'] = chk.carretilla2?.cuentaConCarretilla ? 'SI' : 'NO';
    baseRow['carr2_estado'] = chk.carretilla2?.buenEstadoGeneral || 'N/A';
    baseRow['carr2_llantas'] = chk.carretilla2?.llantasRodamientos || 'N/A';
    baseRow['carr2_etiqueta'] = chk.carretilla2?.etiquetaCoherente || 'N/A';

    baseRow['observaciones'] = chk.observacionesGenerales || '';

    return baseRow;
  });

  // Create dictionary sheet
  const dictRows = ITEMS_INSPECCION.map((it) => ({
    codigo_columna: it.codigoCorto,
    paso: it.paso,
    categoria: it.categoria,
    pregunta_completa: it.pregunta,
    es_critico: it.esCritico ? 'SI (Genera NO APTO)' : 'NO',
    condicion_tipo: it.soloTipo ? it.soloTipo.join(', ') : 'Todos',
  }));

  // Create workbook
  const wb = XLSX.utils.book_new();
  const wsData = XLSX.utils.json_to_sheet(rows);
  const wsDict = XLSX.utils.json_to_sheet(dictRows);

  XLSX.utils.book_append_sheet(wb, wsData, 'Checklists_Patio');
  XLSX.utils.book_append_sheet(wb, wsDict, 'Diccionario_Columnas');

  // Trigger download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `CheckList_Camiones_BU_COL_${dateStr}.xlsx`);
}

/**
 * Generates UTF-8 CSV with BOM for direct Google Sheets or Excel import
 */
export function exportChecklistsToCSV(checklists: ChecklistData[]): void {
  if (checklists.length === 0) return;

  const headers = [
    'folio',
    'fecha_hora',
    'regional',
    'cd',
    'tipo_checklist',
    'conductor',
    'cedula',
    'placa',
    'km',
    'estado_general',
    'total_no_cumple',
    ...ITEMS_INSPECCION.map((i) => i.codigoCorto),
    'carr1_posee',
    'carr1_estado',
    'carr2_posee',
    'carr2_estado',
    'observaciones',
  ];

  const escapeCSV = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvRows = [headers.join(',')];

  checklists.forEach((chk) => {
    const row = [
      escapeCSV(chk.folio),
      escapeCSV(chk.fechaAmigable || chk.fechaHora),
      escapeCSV(chk.regional),
      escapeCSV(chk.centroDistribucion),
      escapeCSV(chk.tipo),
      escapeCSV(chk.conductorNombre),
      escapeCSV(chk.conductorCedula),
      escapeCSV(chk.placa),
      chk.kilometraje,
      escapeCSV(chk.estadoFinal),
      chk.totalNoCumple,
    ];

    ITEMS_INSPECCION.forEach((item) => {
      const resp = chk.respuestas[item.id];
      const text = resp?.comentario ? `${resp.estado} (${resp.comentario})` : resp?.estado || 'N/A';
      row.push(escapeCSV(text));
    });

    row.push(escapeCSV(chk.carretilla1?.cuentaConCarretilla ? 'SI' : 'NO'));
    row.push(escapeCSV(chk.carretilla1?.buenEstadoGeneral || 'N/A'));
    row.push(escapeCSV(chk.carretilla2?.cuentaConCarretilla ? 'SI' : 'NO'));
    row.push(escapeCSV(chk.carretilla2?.buenEstadoGeneral || 'N/A'));
    row.push(escapeCSV(chk.observacionesGenerales || ''));

    csvRows.push(row.join(','));
  });

  // UTF-8 BOM \uFEFF ensures Google Sheets and Excel interpret tildes and ñ correctly
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `CheckList_Camiones_BU_COL_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
