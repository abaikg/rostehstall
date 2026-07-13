import type { Product } from "@/data/catalog";
import type {
  CalculatorPreset,
  InputFieldKey,
  MaterialCode,
  MaterialGradeCode,
  ProductCode,
} from "./types";
import { BEAM_SECTIONS, CHANNEL_SECTIONS } from "./config/sections";
import { MATERIAL_GRADES } from "./config/materials";

// ── Генерация пресетов калькулятора из живого каталога ────────────────
// Источник истины — data/products.json (редактируется в админке): размеры
// парсятся из полей size/thickness, а вес 1 м / 1 м² берётся напрямую из
// каталога (weightMeter / weightSquareMeter), а не из приближённой формулы.

// Как парсить габариты позиции в поля калькулятора
type ParseKind =
  | "round_pipe" // size "Ø" или "ØxT" + thickness
  | "profile_pipe" // size "AxB" + thickness
  | "diameter" // size → diameter (круг, арматура, шестигранник)
  | "square" // size → сторона
  | "strip" // size → ширина, thickness → толщина
  | "angle" // size "AxBxT"
  | "sheet" // thickness → толщина, size "WxL" → ширина
  | "channel" // size → номер по ГОСТ 8240
  | "beam"; // size → номер по ГОСТ 8239

interface SubcategoryRule {
  productCode: ProductCode;
  materialCode: MaterialCode;
  gradeCode?: MaterialGradeCode;
  kind: ParseKind;
}

// Подкатегории без правила (метизы, фитинги, сетки, канаты и т.п.) в
// калькулятор не попадают — для них погонный вес не считается.
const SUBCATEGORY_RULES: Record<string, SubcategoryRule> = {
  // Трубный прокат
  "Бесшовные трубы": { productCode: "pipe_round", materialCode: "steel", kind: "round_pipe" },
  "Электросварные трубы": { productCode: "pipe_round", materialCode: "steel", kind: "round_pipe" },
  "ВГП трубы": { productCode: "pipe_round", materialCode: "steel", kind: "round_pipe" },
  "Котельные трубы": { productCode: "pipe_round", materialCode: "steel", kind: "round_pipe" },
  "Оцинкованные трубы": { productCode: "pipe_round", materialCode: "steel", kind: "round_pipe" },
  "Нержавеющие трубы": { productCode: "pipe_round", materialCode: "stainless", kind: "round_pipe" },
  "Трубы нержавеющие (круглые)": { productCode: "pipe_round", materialCode: "stainless", kind: "round_pipe" },
  "Профильные квадратные трубы": { productCode: "pipe_profile", materialCode: "steel", kind: "profile_pipe" },
  "Профильные прямоугольные трубы": { productCode: "pipe_profile", materialCode: "steel", kind: "profile_pipe" },
  "Профильные трубы нержавеющие": { productCode: "pipe_profile", materialCode: "stainless", kind: "profile_pipe" },

  // Сортовой прокат
  "Арматура": { productCode: "rebar", materialCode: "steel", kind: "diameter" },
  "Круг": { productCode: "rod", materialCode: "steel", kind: "diameter" },
  "Круг нержавеющий": { productCode: "rod", materialCode: "stainless", kind: "diameter" },
  "Квадрат": { productCode: "square", materialCode: "steel", kind: "square" },
  "Полоса": { productCode: "strip", materialCode: "steel", kind: "strip" },
  "Полоса нержавеющая": { productCode: "strip", materialCode: "stainless", kind: "strip" },
  "Шестигранник": { productCode: "hex", materialCode: "steel", kind: "diameter" },

  // Фасонный прокат
  "Уголок равнополочный": { productCode: "angle", materialCode: "steel", kind: "angle" },
  "Уголок неравнополочный": { productCode: "angle", materialCode: "steel", kind: "angle" },
  "Уголок нержавеющий": { productCode: "angle", materialCode: "stainless", kind: "angle" },
  "Швеллер": { productCode: "channel", materialCode: "steel", kind: "channel" },
  "Балка двутавровая (обычная)": { productCode: "beam", materialCode: "steel", kind: "beam" },
  "Балка двутавровая (широкополочная)": { productCode: "beam", materialCode: "steel", kind: "beam" },

  // Листовой прокат
  "Лист горячекатаный": { productCode: "sheet", materialCode: "steel", kind: "sheet" },
  "Лист холоднокатаный": { productCode: "sheet", materialCode: "steel", kind: "sheet" },
  "Лист оцинкованный": { productCode: "sheet", materialCode: "steel", kind: "sheet" },
  "Лист рифлёный (ромб)": { productCode: "sheet", materialCode: "steel", kind: "sheet" },
  "Лист рифлёный (чечевица)": { productCode: "sheet", materialCode: "steel", kind: "sheet" },
  "Лист": { productCode: "sheet", materialCode: "steel", kind: "sheet" },
  "Лист нержавеющий": { productCode: "sheet", materialCode: "stainless", kind: "sheet" },
  "Листы нержавеющие": { productCode: "sheet", materialCode: "stainless", kind: "sheet" },

  // Цветной металл
  "Алюминий лист": { productCode: "sheet", materialCode: "aluminum", kind: "sheet" },
  "Алюминий круг": { productCode: "rod", materialCode: "aluminum", kind: "diameter" },
  "Алюминий труба": { productCode: "pipe_round", materialCode: "aluminum", kind: "round_pipe" },
  "Медь лист": { productCode: "sheet", materialCode: "copper", kind: "sheet" },
  "Медь круг": { productCode: "rod", materialCode: "copper", kind: "diameter" },
  "Медь труба": { productCode: "pipe_round", materialCode: "copper", kind: "round_pipe" },
  "Латунь лист": { productCode: "sheet", materialCode: "brass", kind: "sheet" },
  "Латунь круг": { productCode: "rod", materialCode: "brass", kind: "diameter" },
  "Латунь труба": { productCode: "pipe_round", materialCode: "brass", kind: "round_pipe" },
  "Бронза круг": { productCode: "rod", materialCode: "bronze", kind: "diameter" },
  "Бронза труба": { productCode: "pipe_round", materialCode: "bronze", kind: "round_pipe" },
  "Свинец лист": { productCode: "sheet", materialCode: "lead", kind: "sheet" },
  "Свинец пруток": { productCode: "rod", materialCode: "lead", kind: "diameter" },
  "Дюраль лист": { productCode: "sheet", materialCode: "aluminum", gradeCode: "d16t", kind: "sheet" },
  "Дюраль круг": { productCode: "rod", materialCode: "aluminum", gradeCode: "d16t", kind: "diameter" },
  "Цинк лист": { productCode: "sheet", materialCode: "zinc", kind: "sheet" },
};

// ── Марка из каталога → марка калькулятора ────────────────────────────
// Ключи — нормализованные значения поля steelGrade из data/products.json.
// Для сдвоенных марок («Ст3сп/09Г2С») берётся первая названная.
const GRADE_MAP: Record<string, MaterialGradeCode> = {
  "ст3сп/09г2с": "st3",
  "ст3сп/20": "st3",
  "ст3сп/20/45": "st3",
  "ст2сп/ст3сп": "st3",
  "ст2сп/ст3сп (оцинк.)": "st3",
  "ст3сп/08пс": "st3",
  "ст3сп/08пс (оцинк.)": "st3",
  "08пс/ст3": "steel_08ps",
  "а400с/а500с": "a500c",
  "ст20": "st20",
  "сталь 20": "st20",
  "сталь 10": "st10",
  "ст35": "st35",
  "45": "st45",
  "20х": "kh20",
  "40х": "kh40",
  "30хгса": "khgsa30",
  "35хгса": "khgsa35",
  "38хс": "khs38",
  "12х1мф": "kh1mf12",
  "15гс": "gs15",
  "09г2с": "steel_09g2s",
  "ад31": "ad31",
  "ад0": "ad0",
  "а5": "a5",
  "д16т": "d16t",
  "д16ат": "d16t",
  "л63": "l63",
  "лс59-1": "ls59",
  "м1": "m1",
  "м2": "m2",
  "броф10-1": "brof",
  "браж9-4": "braj94",
  "с1": "s1",
  "с2": "s2",
  "ц0": "zn0",
  "ц1": "zn1",
};

function mapGrade(steelGrade: string | undefined, materialCode: MaterialCode): MaterialGradeCode | undefined {
  if (!steelGrade) return undefined;
  const normalized = steelGrade.trim().toLowerCase();

  // AISI-марки встречаются с уточнением в скобках: «AISI 304 (12Х18Н10Т)»
  let grade = GRADE_MAP[normalized];
  if (!grade && normalized.startsWith("aisi 201")) grade = "aisi_201";
  if (!grade && normalized.startsWith("aisi 304")) grade = "aisi_304";
  if (!grade && normalized.startsWith("aisi 316")) grade = "aisi_316";

  // Марка должна принадлежать металлу позиции — иначе оставляем дефолт
  return grade && MATERIAL_GRADES[grade].materialCode === materialCode ? grade : undefined;
}

// Первое число из строки: «⌀16 мм» → 16, «2,5» → 2.5
const firstNumber = (value: string): number | undefined => {
  const match = value.replace(",", ".").match(/\d+(?:\.\d+)?/);
  const parsed = match ? Number.parseFloat(match[0]) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const num = (value?: string): number | undefined => (value ? firstNumber(value) : undefined);

// "60x40" / "60х40" / "⌀16 мм" (латиница и кириллица, с единицами) → [60, 40]
const splitDims = (value?: string): number[] =>
  (value ?? "")
    .split(/[x×х*]/i)
    .map((part) => firstNumber(part))
    .filter((part): part is number => part !== undefined);

function parseValues(kind: ParseKind, product: Product): Partial<Record<InputFieldKey, number>> | null {
  const dims = splitDims(product.size);
  const thickness = num(product.thickness);

  switch (kind) {
    case "round_pipe": {
      const diameter = dims[0];
      const wall = thickness ?? dims[1];
      return diameter && wall ? { diameter, thickness: wall } : null;
    }
    case "profile_pipe": {
      const [sideA, sideB] = dims;
      return sideA && thickness ? { sideA, sideB: sideB ?? sideA, thickness } : null;
    }
    case "diameter":
      return dims[0] ? { diameter: dims[0] } : null;
    case "square":
      return dims[0] ? { sideA: dims[0] } : null;
    case "strip":
      return dims[0] && thickness ? { width: dims[0], thickness } : null;
    case "angle": {
      const [sideA, sideB, t] = dims;
      const wall = thickness ?? t;
      return sideA && wall ? { sideA, sideB: sideB ?? sideA, thickness: wall } : null;
    }
    case "sheet": {
      // size "1500x6000" — ширина листа × длина; ширина идёт в расчёт м²
      const width = dims[0] && dims[0] > 100 ? dims[0] : 1000;
      return thickness ? { thickness, width } : null;
    }
    default:
      return null;
  }
}

// Швеллер/двутавр в каталоге заданы номером по ГОСТ — ищем табличную позицию
function findSectionCode(kind: ParseKind, product: Product): string | undefined {
  const size = (product.size ?? "").replace(",", ".").trim();
  if (!size) return undefined;

  if (kind === "channel") {
    return CHANNEL_SECTIONS.find((section) => section.code === `${size}У`)?.code;
  }
  if (kind === "beam") {
    return BEAM_SECTIONS.find((section) => section.code === size)?.code;
  }
  return undefined;
}

const formatWeight = (value: number, unit: string) =>
  `${value.toLocaleString("ru-RU", { maximumFractionDigits: 3 })} ${unit}`;

/** Пресет для одной позиции каталога; null — позиция не считается в калькуляторе. */
export function buildPresetForProduct(product: Product): CalculatorPreset | null {
  const rule = SUBCATEGORY_RULES[product.subcategory ?? ""];
  if (!rule) return null;

  const kgm = num(product.weightMeter);
  const kgsm = num(product.weightSquareMeter);
  const gradeCode = mapGrade(product.steelGrade, rule.materialCode) ?? rule.gradeCode;

  if (rule.kind === "channel" || rule.kind === "beam") {
    const sectionCode = findSectionCode(rule.kind, product);
    if (!sectionCode && !kgm) return null;
    return {
      id: `catalog-${product.slug}`,
      slug: product.slug,
      title: product.name,
      productCode: rule.productCode,
      materialCode: rule.materialCode,
      gradeCode,
      presetValues: {},
      sectionCode,
      kgm,
      weightDisplay: kgm ? formatWeight(kgm, "кг/м") : "",
    };
  }

  const presetValues = parseValues(rule.kind, product);
  if (!presetValues) return null;

  // Без справочного веса пресет остаётся полезным — вес посчитает формула
  const weightDisplay = kgm
    ? formatWeight(kgm, "кг/м")
    : kgsm
      ? formatWeight(kgsm, "кг/м²")
      : "";

  return {
    id: `catalog-${product.slug}`,
    slug: product.slug,
    title: product.name,
    productCode: rule.productCode,
    materialCode: rule.materialCode,
    gradeCode,
    presetValues,
    kgm,
    kgsm: rule.productCode === "sheet" ? kgsm : undefined,
    weightDisplay,
  };
}

/** Все пресеты калькулятора из актуального каталога. */
export function buildCalculatorPresets(products: Product[]): CalculatorPreset[] {
  const presets: CalculatorPreset[] = [];
  for (const product of products) {
    const preset = buildPresetForProduct(product);
    if (preset) presets.push(preset);
  }
  return presets;
}

/** Есть ли для товара расчёт в калькуляторе (для ссылки с карточки). */
export function findCalculatorPresetForProduct(product: Product): CalculatorPreset | null {
  return buildPresetForProduct(product);
}
