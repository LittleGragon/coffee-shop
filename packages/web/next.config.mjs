/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Configure rewrites to handle page components with -page suffix
  async rewrites() {
    return [
      {
        source: '/checkout',
        destination: '/checkout-page',
      },
      {
        source: '/membership',
        destination: '/membership-page',
      },
      {
        source: '/reservation',
        destination: '/reservation-page',
      },
      {
        source: '/cake-customization',
        destination: '/cake-customization-page',
      }
      // Removed the root path rewrite to use index.tsx directly
    ];
  },
};

export default nextConfig;