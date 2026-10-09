import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Le back-office garde sa propre typographie, indépendante du site vitrine
  return <div className="font-admin">{children}</div>;
}


