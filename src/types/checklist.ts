export type Regional = 'Norte' | 'Sur' | 'Centro' | 'Andes';

export type TipoCheckList = 'Salida' | 'Retorno' | 'Relevo';

export type EstadoGeneral = 'APROBADO' | 'RECHAZADO' | 'APTO' | 'NO APTO';

export type EstadoItem = 'CUMPLE' | 'NO CUMPLE' | 'N/A';

export interface ItemInspeccion {
  id: string;
  paso: number;
  categoria: string;
  pregunta: string;
  codigoCorto: string; // Used for Excel columns
  esCritico?: boolean; // Causes "NO APTO" if NO CUMPLE
  permiteNA?: boolean;
  soloTipo?: TipoCheckList[];
}

export interface RespuestaItem {
  estado: EstadoItem;
  comentario?: string;
  foto?: string; // Base64 data URL
}

export interface CarretillaDetalle {
  cuentaConCarretilla: boolean;
  buenEstadoGeneral?: EstadoItem;
  llantasRodamientos?: EstadoItem;
  etiquetaCoherente?: EstadoItem;
  comentario?: string;
  foto?: string;
}

export interface ChecklistData {
  id?: string;
  folio?: string;
  fechaHora: string; // ISO string
  fechaAmigable?: string;

  // Paso 1: Información General
  regional: Regional;
  centroDistribucion: string;
  tipo: TipoCheckList;
  conductorNombre: string;
  conductorCedula: string;
  placa: string;
  kilometraje: number;

  // Respuestas ítems pasos 2 al 11
  respuestas: Record<string, RespuestaItem>;

  // Paso 12: Carretillas
  carretilla1: CarretillaDetalle;
  carretilla2: CarretillaDetalle;

  // Paso 13: Cierre
  conductorCondiciones: boolean; // SI/NO
  vehiculoCondiciones: boolean; // SI/NO
  sugeridoSistema: EstadoGeneral;
  estadoFinal: EstadoGeneral;
  totalNoCumple: number;
  observacionesGenerales?: string;
  observacionesFotos?: string[]; // Up to 4 photos for collage
  firmaConductor?: boolean;
}
