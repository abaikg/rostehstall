import { MaterialCode, MaterialConfig } from "../types";

export const MATERIALS: Record<MaterialCode, MaterialConfig> = {
  steel: {
    code: 'steel',
    name: 'Сталь',
    density: 7850,
  },
  stainless: {
    code: 'stainless',
    name: 'Нержавейка',
    density: 8000,
  },
  aluminum: {
    code: 'aluminum',
    name: 'Алюминий',
    density: 2700,
  },
  copper: {
    code: 'copper',
    name: 'Медь',
    density: 8900,
  },
  brass: {
    code: 'brass',
    name: 'Латунь',
    density: 8500,
  },
};

export const MATERIAL_LIST = Object.values(MATERIALS);
