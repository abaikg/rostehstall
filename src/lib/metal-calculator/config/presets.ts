import { CalculatorPreset } from "../types";

const GOOGLE_DOC_REF = "google-doc:1Nq-1vyHnnLXUc_GSOt1GW9hvuaStDDcxYqMwjsJ7DZE";

export const CALCULATOR_PRESETS: CalculatorPreset[] = [
  { id: "doc-rebar-8", title: "Арматура рифлёная Ø8 A500C", productCode: "rebar", materialCode: "steel", presetValues: { diameter: 8 }, weightDisplay: "0,40 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#01` },
  { id: "doc-rebar-10", title: "Арматура рифлёная Ø10 A500C", productCode: "rebar", materialCode: "steel", presetValues: { diameter: 10 }, weightDisplay: "0,62 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#02` },
  { id: "doc-rebar-12", title: "Арматура рифлёная Ø12 A500C", productCode: "rebar", materialCode: "steel", presetValues: { diameter: 12 }, weightDisplay: "0,90 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#03` },
  { id: "doc-rebar-14", title: "Арматура рифлёная Ø14 A500C", productCode: "rebar", materialCode: "steel", presetValues: { diameter: 14 }, weightDisplay: "1,21 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#04` },
  { id: "doc-rebar-16", title: "Арматура рифлёная Ø16 A500C", productCode: "rebar", materialCode: "steel", presetValues: { diameter: 16 }, weightDisplay: "1,60 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#05` },
  { id: "doc-rebar-18", title: "Арматура рифлёная Ø18 A500C", productCode: "rebar", materialCode: "steel", presetValues: { diameter: 18 }, weightDisplay: "2,00 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#06` },
  { id: "doc-rebar-20", title: "Арматура рифлёная Ø20 A500C", productCode: "rebar", materialCode: "steel", presetValues: { diameter: 20 }, weightDisplay: "2,47 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#07` },
  { id: "doc-rebar-22", title: "Арматура рифлёная Ø22 A500C", productCode: "rebar", materialCode: "steel", presetValues: { diameter: 22 }, weightDisplay: "2,98 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#08` },
  { id: "doc-rebar-25", title: "Арматура рифлёная Ø25 A500C", productCode: "rebar", materialCode: "steel", presetValues: { diameter: 25 }, weightDisplay: "3,85 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#09` },
  { id: "doc-rod-65", title: "Катанка Ø6,5 A-I", productCode: "rod", materialCode: "steel", presetValues: { diameter: 6.5 }, weightDisplay: "0,26 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#10` },
  { id: "doc-profile-20x20x15", title: "Профильная труба 20×20×1,5 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 20, sideB: 20, thickness: 1.5 }, weightDisplay: "0,87 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#11` },
  { id: "doc-profile-25x25x15", title: "Профильная труба 25×25×1,5 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 25, sideB: 25, thickness: 1.5 }, weightDisplay: "1,10 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#12` },
  { id: "doc-profile-40x20x15", title: "Профильная труба 40×20×1,5 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 40, sideB: 20, thickness: 1.5 }, weightDisplay: "1,34 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#13` },
  { id: "doc-profile-40x20x2", title: "Профильная труба 40×20×2 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 40, sideB: 20, thickness: 2 }, weightDisplay: "1,76 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#14` },
  { id: "doc-profile-40x40x2", title: "Профильная труба 40×40×2 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 40, sideB: 40, thickness: 2 }, weightDisplay: "2,38 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#15` },
  { id: "doc-profile-50x25x2", title: "Профильная труба 50×25×2 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 50, sideB: 25, thickness: 2 }, weightDisplay: "2,23 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#16` },
  { id: "doc-profile-50x50x2", title: "Профильная труба 50×50×2 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 50, sideB: 50, thickness: 2 }, weightDisplay: "3,01 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#17` },
  { id: "doc-profile-60x40x2", title: "Профильная труба 60×40×2 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 60, sideB: 40, thickness: 2 }, weightDisplay: "3,01 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#18` },
  { id: "doc-profile-80x40x2", title: "Профильная труба 80×40×2 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 80, sideB: 40, thickness: 2 }, weightDisplay: "3,64 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#19` },
  { id: "doc-profile-100x100x4", title: "Профильная труба 100×100×4 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 100, sideB: 100, thickness: 4 }, weightDisplay: "12,06 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#20` },
  { id: "doc-sheet-2", title: "Лист стальной горячекатаный 2 мм", productCode: "sheet", materialCode: "steel", presetValues: { thickness: 2, width: 1000 }, weightDisplay: "15,70 кг/м²", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#21` },
  { id: "doc-sheet-3", title: "Лист стальной горячекатаный 3 мм", productCode: "sheet", materialCode: "steel", presetValues: { thickness: 3, width: 1000 }, weightDisplay: "23,55 кг/м²", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#22` },
  { id: "doc-sheet-4", title: "Лист стальной горячекатаный 4 мм", productCode: "sheet", materialCode: "steel", presetValues: { thickness: 4, width: 1000 }, weightDisplay: "31,40 кг/м²", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#23` },
  { id: "doc-sheet-galv-05", title: "Лист оцинкованный 0,5 мм", productCode: "sheet", materialCode: "steel", presetValues: { thickness: 0.5, width: 1000 }, weightDisplay: "3,93 кг/м²", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#24` },
  { id: "doc-sheet-cold-15", title: "Лист холоднокатаный 1,5 мм", productCode: "sheet", materialCode: "steel", presetValues: { thickness: 1.5, width: 1000 }, weightDisplay: "11,78 кг/м²", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#25` },
  { id: "doc-sheet-rifled-4", title: "Лист рифлёный 4 мм", productCode: "sheet", materialCode: "steel", presetValues: { thickness: 4, width: 1000 }, weightDisplay: "31–33 кг/м²", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#26` },
  { id: "doc-angle-40x40x4", title: "Уголок стальной 40×40×4 мм", productCode: "angle", materialCode: "steel", presetValues: { sideA: 40, sideB: 40, thickness: 4 }, weightDisplay: "2,60 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#27` },
  { id: "doc-angle-50x50x5", title: "Уголок стальной 50×50×5 мм", productCode: "angle", materialCode: "steel", presetValues: { sideA: 50, sideB: 50, thickness: 5 }, weightDisplay: "3,90 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#28` },
  { id: "doc-channel-10", title: "Швеллер стальной №10", productCode: "channel", materialCode: "steel", presetValues: { sideA: 100, sideB: 46, thickness: 4.8 }, weightDisplay: "9,00 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#29` },
  { id: "doc-channel-12", title: "Швеллер стальной №12", productCode: "channel", materialCode: "steel", presetValues: { sideA: 120, sideB: 52, thickness: 4.8 }, weightDisplay: "10,40 кг/м", source: "google_doc", sourceRef: `${GOOGLE_DOC_REF}#30` },
  { id: "catalog-profile-60x40x3", title: "Труба профильная 60×40×3 мм", productCode: "pipe_profile", materialCode: "steel", presetValues: { sideA: 60, sideB: 40, thickness: 3 }, weightDisplay: "4,39 кг/м", source: "catalog", sourceRef: "catalog:truba-profilnaya-60x40x3" },
  { id: "catalog-pipe-steel-85x5", title: "Бесшовная стальная труба 85×5 мм", productCode: "pipe_round", materialCode: "steel", presetValues: { diameter: 85, thickness: 5 }, weightDisplay: "9,87 кг/м", source: "catalog", sourceRef: "catalog:besshovnye-stalnye-truby" },
  { id: "catalog-pipe-steel-131x6", title: "Горячедеформированная труба 131×6 мм", productCode: "pipe_round", materialCode: "steel", presetValues: { diameter: 131, thickness: 6 }, weightDisplay: "18,50 кг/м", source: "catalog", sourceRef: "catalog:besshovnye-goryachedef-truby" },
  { id: "catalog-pipe-bronze-48x28", title: "Бронзовая труба 48×2,8 мм", productCode: "pipe_round", materialCode: "bronze", presetValues: { diameter: 48, thickness: 2.8 }, weightDisplay: "3,50 кг/м", source: "catalog", sourceRef: "catalog:bronzovaya-truba" },
  { id: "catalog-pipe-copper-24x15", title: "Медная труба 24×1,5 мм", productCode: "pipe_round", materialCode: "copper", presetValues: { diameter: 24, thickness: 1.5 }, weightDisplay: "0,94 кг/м", source: "catalog", sourceRef: "catalog:mednye-truby" },
  { id: "catalog-pipe-lead-50x37", title: "Свинцовая труба 50×3,7 мм", productCode: "pipe_round", materialCode: "lead", presetValues: { diameter: 50, thickness: 3.7 }, weightDisplay: "6,10 кг/м", source: "catalog", sourceRef: "catalog:svincovaya-truba" },
  { id: "catalog-profile-al-50x50x15", title: "Алюминиевая квадратная труба 50×50×1,5 мм", productCode: "pipe_profile", materialCode: "aluminum", presetValues: { sideA: 50, sideB: 50, thickness: 1.5 }, weightDisplay: "0,78 кг/м", source: "catalog", sourceRef: "catalog:aluminievye-kvadratnye-truby" },
  { id: "catalog-profile-al-70x50x15", title: "Алюминиевая прямоугольная труба 70×50×1,5 мм", productCode: "pipe_profile", materialCode: "aluminum", presetValues: { sideA: 70, sideB: 50, thickness: 1.5 }, weightDisplay: "0,95 кг/м", source: "catalog", sourceRef: "catalog:aluminievye-pryamougol-truby" },
  { id: "catalog-pipe-stainless-6x06", title: "Нержавеющая капиллярная трубка 6×0,6 мм", productCode: "pipe_round", materialCode: "stainless", presetValues: { diameter: 6, thickness: 0.6 }, weightDisplay: "0,08 кг/м", source: "catalog", sourceRef: "catalog:nerzhav-kapillyarnye-trubki" },
  { id: "catalog-pipe-cast-iron-200x105", title: "Чугунная напорная труба 200×10,5 мм", productCode: "pipe_round", materialCode: "cast_iron", presetValues: { diameter: 200, thickness: 10.5 }, weightDisplay: "45,00 кг/м", source: "catalog", sourceRef: "catalog:chugunnyye-napornye-truby" },
];

export const CALCULATOR_PRESET_GROUPS = [
  { key: "google_doc", label: "30 позиций из Google Doc", items: CALCULATOR_PRESETS.filter((preset) => preset.source === "google_doc") },
  { key: "catalog", label: "10 позиций из локального каталога", items: CALCULATOR_PRESETS.filter((preset) => preset.source === "catalog") },
];

export const CALCULATOR_PRESET_MAP = Object.fromEntries(
  CALCULATOR_PRESETS.map((preset) => [preset.id, preset])
);
