import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="container py-24 flex flex-col items-center gap-4 text-center">
      <p className="text-[18px] font-bold text-gray-900">Товар не найден</p>
      <p className="text-gray-500">Возможно, он был удалён или вы ввели неверный адрес.</p>
      <Link href="/catalog" className="inline-flex items-center gap-2 bg-brand-primary text-white font-semibold text-[14px] px-6 py-3 rounded-xl transition-all hover:bg-brand-primary/90">
        Вернуться в каталог
      </Link>
    </div>
  );
}
