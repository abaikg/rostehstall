import { MetalCalculator } from "@/components/calculator/MetalCalculator";
import { buildCalculatorPresets } from "@/lib/metal-calculator/catalogPresets";
import { getProducts } from "@/lib/db";

type CalculatorPageProps = {
  searchParams: Promise<{ item?: string }>;
};

export default async function CalculatorPage({ searchParams }: CalculatorPageProps) {
  const { item } = await searchParams;
  // Пресеты собираются из актуального каталога (data/products.json) на сервере
  const presets = buildCalculatorPresets(getProducts());
  const initialPresetId = item
    ? presets.find((preset) => preset.slug === item)?.id
    : undefined;

  return (
    <div className="pb-10 pt-2 sm:pb-16 sm:pt-8">
      <div className="container">
        <h1 className="sr-only">Калькулятор веса металлопроката</h1>
        <MetalCalculator presets={presets} initialPresetId={initialPresetId} />
      </div>
    </div>
  );
}
