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
  bronze: {
    code: 'bronze',
    name: 'Bronze',
    density: 8800,
  },
  lead: {
    code: 'lead',
    name: 'Lead',
    density: 11340,
  },
  cast_iron: {
    code: 'cast_iron',
    name: 'Cast Iron',
    density: 7200,
  },
};

export const MATERIAL_LIST = Object.values(MATERIALS);
