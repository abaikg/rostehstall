export default function Loading() {
  return (
    <div className="fixed inset-0 bg-brand-bg z-[100] flex flex-col items-center justify-center p-6">
      <div className="relative flex flex-col items-center">
        {/* Animated Track */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-primary animate-spin"></div>
        </div>

        {/* Brand Text */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-[12px] font-bold text-brand-dark opacity-40 uppercase tracking-[0.4em] ml-2 animate-pulse">
            Загрузка склада...
          </div>
        </div>
      </div>
    </div>
  );
}
