import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-24 flex flex-col items-center gap-4 text-center">
      <p className="text-[64px] font-bold leading-none text-gray-200">404</p>
      <p className="text-[18px] font-bold text-gray-900">Страница не найдена</p>
      <p className="text-gray-500 max-w-md">
        Возможно, страница была удалена или вы перешли по неверной ссылке.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold text-[14px] px-6 py-3 rounded-xl transition-all hover:bg-brand-primary/90"
        >
          На главную
        </Link>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-900 font-semibold text-[14px] px-6 py-3 rounded-xl transition-all hover:bg-gray-200"
        >
          Каталог металлопроката
        </Link>
      </div>
    </div>
  );
}
