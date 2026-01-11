/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Use Docker service name when running in Docker, otherwise localhost
    const backendUrl = process.env.BACKEND_URL || 'http://backend:8000'
    return [
      // Proxy /api/* requests to the backend to avoid CORS in dev
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
