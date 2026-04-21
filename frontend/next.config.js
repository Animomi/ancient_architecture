/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['three'],
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
