import { supabase, FOTOS_BUCKET } from '../lib/supabase';
import { ChecklistData, EstadoGeneral } from '../types/checklist';

/**
 * Envío de checklists a Supabase.
 * - Las fotos se comprimen (máx. 1280 px, JPEG) y se suben al bucket privado.
 * - El servidor valida y calcula el resultado (APROBADO / RECHAZADO).
 * - Sin señal, el checklist queda en cola en este celular y se reenvía solo,
 *   sin duplicarse (el id se genera aquí y el servidor es idempotente).
 */

type NuevoChecklist = Omit<ChecklistData, 'id' | 'folio' | 'fechaHora' | 'fechaAmigable'>;

interface Pendiente {
  id: string;
  fechaHora: string;
  data: NuevoChecklist;
}

export interface ResultadoEnvio {
  record: ChecklistData;
  pendiente: boolean; // true = guardado en el celular, se enviará al volver la señal
}

const COLA_KEY = 'maz_bu_col_pendientes_v1';
const EVENTO_COLA = 'checklist-cola-cambio';

export class ErrorValidacion extends Error {}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
  );
}

function fechaAmigable(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/* ---------- Cola local ---------- */
export function leerCola(): Pendiente[] {
  try {
    const raw = localStorage.getItem(COLA_KEY);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function guardarCola(cola: Pendiente[]): void {
  try {
    localStorage.setItem(COLA_KEY, JSON.stringify(cola));
  } catch (e) {
    console.error('No se pudo guardar la cola local (¿almacenamiento lleno?)', e);
  }
  window.dispatchEvent(new Event(EVENTO_COLA));
}
export function escucharCola(cb: (n: number) => void): () => void {
  const h = () => cb(leerCola().length);
  window.addEventListener(EVENTO_COLA, h);
  return () => window.removeEventListener(EVENTO_COLA, h);
}

/* ---------- Fotos ---------- */
async function comprimir(dataUrl: string, max = 1280, calidad = 0.72): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((ok, fail) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = fail;
    i.src = dataUrl;
  });
  const escala = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((ok, fail) =>
    canvas.toBlob((b) => (b ? ok(b) : fail(new Error('No se pudo comprimir la foto'))), 'image/jpeg', calidad)
  );
}

async function subirFoto(id: string, nombre: string, dataUrl?: string): Promise<string | undefined> {
  if (!dataUrl) return undefined;
  if (!dataUrl.startsWith('data:')) return dataUrl; // ya es una ruta del bucket
  const ruta = `${id}/${nombre}.jpg`;
  const blob = await comprimir(dataUrl);
  const { error } = await supabase.storage.from(FOTOS_BUCKET).upload(ruta, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  });
  // "Duplicate" significa que ya se subió en un intento anterior: sirve igual
  if (error && !/exist|duplicate/i.test(error.message)) throw error;
  return ruta;
}

/* ---------- Envío ---------- */
function esErrorDeRed(e: unknown): boolean {
  const msg = String((e as { message?: string })?.message || e || '');
  return (
    !navigator.onLine ||
    /Failed to fetch|NetworkError|Load failed|network|timeout|fetch/i.test(msg) ||
    /^5\d\d$/.test(String((e as { code?: string })?.code || ''))
  );
}

async function enviarAlServidor(p: Pendiente): Promise<{ folio: string; estado: EstadoGeneral }> {
  const d = p.data;
  const respuestas: Record<string, { estado: string; comentario?: string; foto?: string }> = {};
  for (const [codigo, r] of Object.entries(d.respuestas)) {
    respuestas[codigo] = {
      estado: r.estado,
      comentario: r.comentario,
      foto: await subirFoto(p.id, codigo, r.foto),
    };
  }
  const carretilla1 = { ...d.carretilla1, foto: await subirFoto(p.id, 'carretilla1', d.carretilla1?.foto) };
  const carretilla2 = { ...d.carretilla2, foto: await subirFoto(p.id, 'carretilla2', d.carretilla2?.foto) };
  const observacionesFotos: string[] = [];
  for (const [i, f] of (d.observacionesFotos || []).slice(0, 4).entries()) {
    const ruta = await subirFoto(p.id, `observacion-${i + 1}`, f);
    if (ruta) observacionesFotos.push(ruta);
  }

  const { data, error } = await supabase.rpc('registrar_inspeccion', {
    p: {
      id: p.id,
      fechaHora: p.fechaHora,
      centroDistribucion: d.centroDistribucion,
      tipo: d.tipo,
      conductorNombre: d.conductorNombre,
      conductorCedula: d.conductorCedula,
      placa: d.placa,
      kilometraje: d.kilometraje,
      respuestas,
      carretilla1,
      carretilla2,
      conductorCondiciones: d.conductorCondiciones,
      vehiculoCondiciones: d.vehiculoCondiciones,
      observacionesGenerales: d.observacionesGenerales,
      observacionesFotos,
      firmaConductor: d.firmaConductor,
    },
  });
  if (error) {
    // Errores de datos (400) no se reintentan: se muestran al conductor
    if (error.code && /^(22|23|P0|42)/.test(error.code)) throw new ErrorValidacion(error.message);
    throw error;
  }
  return { folio: data.folio, estado: data.estadoApp as EstadoGeneral };
}

export async function enviarChecklist(data: NuevoChecklist): Promise<ResultadoEnvio> {
  const p: Pendiente = { id: uuid(), fechaHora: new Date().toISOString(), data };
  const base: ChecklistData = { ...data, id: p.id, fechaHora: p.fechaHora, fechaAmigable: fechaAmigable(p.fechaHora) };
  try {
    const r = await enviarAlServidor(p);
    return { record: { ...base, folio: r.folio, estadoFinal: r.estado, sugeridoSistema: r.estado }, pendiente: false };
  } catch (e) {
    if (e instanceof ErrorValidacion || !esErrorDeRed(e)) {
      if (e instanceof ErrorValidacion) throw e;
      throw new ErrorValidacion((e as Error)?.message || 'No se pudo registrar el checklist');
    }
    guardarCola([...leerCola(), p]);
    return { record: { ...base, folio: 'PENDIENTE' }, pendiente: true };
  }
}

let enviando = false;
export async function reenviarPendientes(): Promise<number> {
  if (enviando || !navigator.onLine) return 0;
  const cola = leerCola();
  if (!cola.length) return 0;
  enviando = true;
  const resto: Pendiente[] = [];
  let enviados = 0;
  for (const p of cola) {
    try {
      await enviarAlServidor(p);
      enviados++;
    } catch (e) {
      if (e instanceof ErrorValidacion) {
        console.warn('Checklist pendiente rechazado por el servidor:', e.message, p.data.placa);
        enviados++; // se descarta: reintentarlo no lo arreglaría
      } else {
        resto.push(p);
      }
    }
  }
  guardarCola(resto);
  enviando = false;
  return enviados;
}

export function iniciarReenvioAutomatico(): void {
  reenviarPendientes();
  window.addEventListener('online', () => reenviarPendientes());
  setInterval(() => reenviarPendientes(), 60_000);
}
