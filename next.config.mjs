/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
        missing: [
          {
            type: 'cookie',
            key: 'collateraliq_auth',
            value: 'true',
          },
          {
            type: 'cookie',
            key: 'collateral_iq_auth',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
