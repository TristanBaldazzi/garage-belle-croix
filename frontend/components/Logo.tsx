import Link from 'next/link';

// Logo officiel vectorisé (public/logo) : version horizontale blanche pour les fonds sombres
export default function Logo({ onClick, size = 'md' }: { onClick?: () => void; size?: 'md' | 'lg' }) {
  return (
    <Link href="/" onClick={onClick} className="flex flex-shrink-0 items-center" aria-label="Garage de la Belle Croix — accueil">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/logo-belle-croix-horizontal-white.svg"
        alt="Garage de la Belle Croix"
        width={3211}
        height={510}
        className={size === 'lg' ? 'h-12 w-auto md:h-14' : 'h-9 w-auto lg:h-11'}
      />
    </Link>
  );
}
