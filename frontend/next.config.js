/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ne pas annoncer la techno du serveur (en-tête X-Powered-By)
  poweredByHeader: false,
  // En-têtes de sécurité sur toutes les réponses
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Navigateur forcé en HTTPS pendant 1 an
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Pas de devinette du type de fichier
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Anti-clickjacking : le site ne peut pas être affiché dans une iframe externe
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'garagebellecroix.fr',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.garagebellecroix.fr',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.garagebellecroix.fr',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig

