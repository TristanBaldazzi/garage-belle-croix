import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration',
  robots: {
    index: false,
    follow: false,
    noindex: true,
    nofollow: true,
    googleBot: {
      index: false,
      follow: false,
      noindex: true,
      nofollow: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

