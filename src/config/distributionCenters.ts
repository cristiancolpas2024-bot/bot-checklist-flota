import { Regional } from '../types/checklist';

export interface DistributionCentersConfig {
  Norte: string[];
  Sur: string[];
  Centro: string[];
  Andes: string[];
}

export const DEFAULT_DISTRIBUTION_CENTERS: DistributionCentersConfig = {
  Norte: [
    'DC La Arenosa',
    'DC Galapa',
    'DC Riohacha',
    'DC Montería',
    'DC Curumaní',
    'DC Magangué',
    'DC Cúcuta',
    'DC Corozal',
    'DC Fonseca',
    'DC Santa Marta',
    'DC Turbaco',
    'DC Valledupar',
    'DC Caucasia',
    'DC San Andrés',
  ],
  Sur: [
    'DC Cali',
    'DC Yumbo',
    'DC Pasto',
    'DC Popayán',
    'DC Neiva',
    'DC Buenaventura',
    'DC Ipiales',
    'DC Buga',
  ],
  Centro: [
    'DC Bogotá Norte',
    'DC Bogotá Sur (Fontibón)',
    'DC Soacha',
    'DC Mosquera',
    'DC Villavicencio',
    'DC Girardot',
    'DC Ibagué',
    'DC Tunja',
    'DC Duitama',
  ],
  Andes: [
    'DC Medellín (Itagüí)',
    'DC Envigado',
    'DC Bello',
    'DC Rionegro',
    'DC Pereira',
    'DC Manizales',
    'DC Armenia',
    'DC Bucaramanga',
    'DC Barrancabermeja',
  ],
};

const STORAGE_KEY_DCS = 'maz_bu_col_dc_config';

export function getDistributionCenters(): DistributionCentersConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DCS);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure all regionals exist
      return {
        Norte: parsed.Norte || DEFAULT_DISTRIBUTION_CENTERS.Norte,
        Sur: parsed.Sur || DEFAULT_DISTRIBUTION_CENTERS.Sur,
        Centro: parsed.Centro || DEFAULT_DISTRIBUTION_CENTERS.Centro,
        Andes: parsed.Andes || DEFAULT_DISTRIBUTION_CENTERS.Andes,
      };
    }
  } catch (e) {
    console.error('Error cargando centros de distribución:', e);
  }
  return DEFAULT_DISTRIBUTION_CENTERS;
}

export function saveDistributionCenters(config: DistributionCentersConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_DCS, JSON.stringify(config));
  } catch (e) {
    console.error('Error guardando centros de distribución:', e);
  }
}

export function resetDistributionCenters(): DistributionCentersConfig {
  try {
    localStorage.removeItem(STORAGE_KEY_DCS);
  } catch (e) {
    console.error('Error reseteando centros de distribución:', e);
  }
  return DEFAULT_DISTRIBUTION_CENTERS;
}
