/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

