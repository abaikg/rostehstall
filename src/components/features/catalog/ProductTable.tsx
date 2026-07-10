import Link from "next/link";
import type { Product } from "@/data/catalog";
import { slugifySegment } from "@/lib/catalogRoutes";

type ProductTableProps = {
  products: Product[];
  showCategory?: boolean;
};

const columns = [
  { key: "gost", label: "ГОСТ" },
  { key: "steelGrade", label: "Марка" },
  { key: "size", label: "Размер" },
  { key: "thickness", label: "Толщина" },
  { key: "weightMeter", label: "Вес 1м, кг" },
  { key: "weightSquareMeter", label: "Вес 1м2, кг" },
  { key: "weightItem", label: "Вес изд., кг" },
] as const;

function productValue(product: Product, key: (typeof columns)[number]["key"]) {
  return product[key] || "—";
}

// Колонка показывается только если хотя бы у одного товара группы есть значение —
// иначе (напр. "Вес 1м²" для круглого проката) вся колонка была бы одними прочерками.
function visibleColumns(items: Product[]) {
  return columns.filter((column) => items.some((product) => Boolean(product[column.key])));
}

function groupProducts(products: Product[]) {
  const groups = new Map<string, Product[]>();

  for (const product of products) {
    const group = product.subcategory || product.category;
    groups.set(group, [...(groups.get(group) ?? []), product]);
  }

  return Array.from(groups.entries()).map(([name, items]) => ({
    name,
    items,
    columns: visibleColumns(items),
  }));
}

export function ProductTable({ products, showCategory = false }: ProductTableProps) {
  const groups = groupProducts(products);

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section id={slugifySegment(group.name)} key={group.name} className="scroll-mt-24 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between gap-3 bg-brand-primary px-4 py-3 text-white">
            <h2 className="text-[15px] font-bold uppercase tracking-wide">{group.name}</h2>
            <span className="text-[12px] font-semibold text-white/80">{group.items.length} поз.</span>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-blue-50 text-gray-900">
                  <th className="w-12 border border-white px-3 py-2 text-center font-semibold">№</th>
                  <th className="min-w-64 border border-white px-3 py-2 text-left font-semibold">Наименование</th>
                  {showCategory && <th className="border border-white px-3 py-2 text-left font-semibold">Категория</th>}
                  {group.columns.map((column) => (
                    <th key={column.key} className="border border-white px-3 py-2 text-center font-semibold">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.items.map((product, index) => (
                  <tr key={product.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50/70"}>
                    <td className="border border-white px-3 py-2 text-center text-gray-600">{index + 1}</td>
                    <td className="border border-white px-3 py-2 font-semibold text-gray-900">
                      <Link href={`/catalog/${product.slug}`} className="hover:text-brand-primary">
                        {product.name}
                      </Link>
                    </td>
                    {showCategory && (
                      <td className="border border-white px-3 py-2 text-gray-600">{product.category}</td>
                    )}
                    {group.columns.map((column) => (
                      <td key={column.key} className="border border-white px-3 py-2 text-center text-gray-700">
                        {productValue(product, column.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-2 p-3 lg:hidden">
            {group.items.map((product) => {
              // На мобильном показываем только реально заполненные поля этой группы
              const weightColumn = group.columns.find((c) =>
                ["weightMeter", "weightSquareMeter", "weightItem"].includes(c.key)
              );
              const hasThickness = group.columns.some((c) => c.key === "thickness");

              return (
                <Link
                  key={product.id}
                  href={`/catalog/${product.slug}`}
                  className="rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-brand-primary"
                >
                  <span className="block text-[14px] font-bold text-gray-900">{product.name}</span>
                  <span className="mt-1 block text-[12px] text-gray-500">
                    {[product.gost, product.steelGrade, product.size && `размер ${product.size}`].filter(Boolean).join(" · ")}
                  </span>
                  {(hasThickness || weightColumn) && (
                    <span className="mt-2 grid grid-cols-2 gap-2 text-[12px] text-gray-600">
                      {hasThickness && <span>Толщина: {product.thickness || "—"}</span>}
                      {weightColumn && <span>{weightColumn.label}: {productValue(product, weightColumn.key)}</span>}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
