import { MaterialCode, MaterialConfig, MaterialGradeCode, MaterialGradeConfig } from "../types";

export const MATERIALS: Record<MaterialCode, MaterialConfig> = {
  steel: {
    code: "steel",
    name: "Сталь",
    density: 7850,
  },
  stainless: {
    code: "stainless",
    name: "Нержавейка",
    density: 8000,
  },
  aluminum: {
    code: "aluminum",
    name: "Алюминий",
    density: 2700,
  },
  copper: {
    code: "copper",
    name: "Медь",
    density: 8900,
  },
  brass: {
    code: "brass",
    name: "Латунь",
    density: 8500,
  },
  bronze: {
    code: "bronze",
    name: "Бронза",
    density: 8800,
  },
  lead: {
    code: "lead",
    name: "Свинец",
    density: 11340,
  },
  zinc: {
    code: "zinc",
    name: "Цинк",
    density: 7130,
  },
  cast_iron: {
    code: "cast_iron",
    name: "Чугун",
    density: 7200,
  },
};

export const MATERIAL_LIST = Object.values(MATERIALS);

// Марки соответствуют реальному ассортименту каталога (data/products.json)
export const MATERIAL_GRADES: Record<MaterialGradeCode, MaterialGradeConfig> = {
  // Чёрная сталь
  st3: { code: "st3", materialCode: "steel", name: "Ст 3", density: 7850 },
  st10: { code: "st10", materialCode: "steel", name: "Сталь 10", density: 7856 },
  st20: { code: "st20", materialCode: "steel", name: "Ст 20", density: 7850 },
  st35: { code: "st35", materialCode: "steel", name: "Ст 35", density: 7826 },
  st45: { code: "st45", materialCode: "steel", name: "Ст 45", density: 7826 },
  steel_08ps: { code: "steel_08ps", materialCode: "steel", name: "08пс", density: 7870 },
  steel_09g2s: { code: "steel_09g2s", materialCode: "steel", name: "09Г2С", density: 7850 },
  a500c: { code: "a500c", materialCode: "steel", name: "A500C", density: 7850 },
  kh20: { code: "kh20", materialCode: "steel", name: "20Х", density: 7830 },
  kh40: { code: "kh40", materialCode: "steel", name: "40Х", density: 7820 },
  khgsa30: { code: "khgsa30", materialCode: "steel", name: "30ХГСА", density: 7850 },
  khgsa35: { code: "khgsa35", materialCode: "steel", name: "35ХГСА", density: 7860 },
  khs38: { code: "khs38", materialCode: "steel", name: "38ХС", density: 7850 },
  kh1mf12: { code: "kh1mf12", materialCode: "steel", name: "12Х1МФ", density: 7800 },
  gs15: { code: "gs15", materialCode: "steel", name: "15ГС", density: 7850 },
  // Нержавейка
  aisi_201: { code: "aisi_201", materialCode: "stainless", name: "AISI 201", density: 7860 },
  aisi_304: { code: "aisi_304", materialCode: "stainless", name: "AISI 304", density: 7930 },
  aisi_316: { code: "aisi_316", materialCode: "stainless", name: "AISI 316", density: 8000 },
  // Алюминий и дюраль
  ad31: { code: "ad31", materialCode: "aluminum", name: "АД31", density: 2710 },
  ad0: { code: "ad0", materialCode: "aluminum", name: "АД0", density: 2710 },
  a5: { code: "a5", materialCode: "aluminum", name: "А5", density: 2710 },
  amg5: { code: "amg5", materialCode: "aluminum", name: "АМг5", density: 2650 },
  d16t: { code: "d16t", materialCode: "aluminum", name: "Д16Т (дюраль)", density: 2780 },
  // Медь
  m1: { code: "m1", materialCode: "copper", name: "М1", density: 8900 },
  m2: { code: "m2", materialCode: "copper", name: "М2", density: 8940 },
  // Латунь
  ls59: { code: "ls59", materialCode: "brass", name: "ЛС59-1", density: 8400 },
  l63: { code: "l63", materialCode: "brass", name: "Л63", density: 8440 },
  // Бронза
  brof: { code: "brof", materialCode: "bronze", name: "БрОФ10-1", density: 8760 },
  braj94: { code: "braj94", materialCode: "bronze", name: "БрАЖ9-4", density: 7600 },
  // Свинец
  s1: { code: "s1", materialCode: "lead", name: "С1", density: 11340 },
  s2: { code: "s2", materialCode: "lead", name: "С2", density: 11340 },
  // Цинк
  zn0: { code: "zn0", materialCode: "zinc", name: "Ц0", density: 7130 },
  zn1: { code: "zn1", materialCode: "zinc", name: "Ц1", density: 7130 },
  // Чугун
  sch20: { code: "sch20", materialCode: "cast_iron", name: "СЧ20", density: 7200 },
};

export const MATERIAL_GRADE_LIST = Object.values(MATERIAL_GRADES);

export const getGradesByMaterial = (material: MaterialCode) =>
  MATERIAL_GRADE_LIST.filter((grade) => grade.materialCode === material);

export const getDefaultGrade = (material: MaterialCode): MaterialGradeCode | undefined => {
  if (material === "steel") return "st3";
  return getGradesByMaterial(material)[0]?.code;
};

export const getMaterialDensity = (material: MaterialCode, grade?: MaterialGradeCode) => {
  if (grade && MATERIAL_GRADES[grade]?.materialCode === material) {
    return MATERIAL_GRADES[grade].density;
  }

  return MATERIALS[material].density;
};
