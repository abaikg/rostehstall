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
  cast_iron: {
    code: "cast_iron",
    name: "Чугун",
    density: 7200,
  },
};

export const MATERIAL_LIST = Object.values(MATERIALS);

export const MATERIAL_GRADES: Record<MaterialGradeCode, MaterialGradeConfig> = {
  st3: { code: "st3", materialCode: "steel", name: "Ст 3", density: 7850 },
  st20: { code: "st20", materialCode: "steel", name: "Ст 20", density: 7850 },
  steel_09g2s: { code: "steel_09g2s", materialCode: "steel", name: "09Г2С", density: 7850 },
  a500c: { code: "a500c", materialCode: "steel", name: "A500C", density: 7850 },
  aisi_304: { code: "aisi_304", materialCode: "stainless", name: "AISI 304", density: 7930 },
  aisi_316: { code: "aisi_316", materialCode: "stainless", name: "AISI 316", density: 8000 },
  ad31: { code: "ad31", materialCode: "aluminum", name: "АД31", density: 2710 },
  amg5: { code: "amg5", materialCode: "aluminum", name: "АМг5", density: 2650 },
  m1: { code: "m1", materialCode: "copper", name: "М1", density: 8900 },
  ls59: { code: "ls59", materialCode: "brass", name: "ЛС59-1", density: 8400 },
  brof: { code: "brof", materialCode: "bronze", name: "БрОФ", density: 8800 },
  s1: { code: "s1", materialCode: "lead", name: "С1", density: 11340 },
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
