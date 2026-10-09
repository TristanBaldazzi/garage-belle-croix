'use client';

export default function LoadingSpinner({
  size = 'large',
  showText = true,
}: {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-10 h-10 border-[3px]',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div className={`${sizeClasses[size]} rounded-full border-line border-t-brand animate-spin`} />
      {showText && <p className="text-sm text-muted">Chargement…</p>}
    </div>
  );
}
