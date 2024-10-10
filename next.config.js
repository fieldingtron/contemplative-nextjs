/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const domains = process.env.DOMAIN_URLS.split(',')

module.exports = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    loader: 'default',
    remotePatterns: domains.map((domain) => ({
      protocol: 'https', // You can also use 'http' if needed
      hostname: domain.trim(),
      pathname: '/**', // Allows all paths for each domain
    })),
  },
}
