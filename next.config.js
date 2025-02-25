/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        os: false,
        path: false,
        stream: require.resolve('stream-browserify'),
        http: false,
        https: false,
        zlib: false,
      };
    }

    // Handle native modules better
    config.externals = [...(config.externals || [])];
    if (isServer) {
      config.externals.push(
        'udx-native',
        'sodium-native',
        'crc-native',
        'fs-native-extensions',
        'quickbit-native',
        'simdle-native'
      );
    }

    return config;
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  serverExternalPackages: [
    'sodium-native',
    'udx-native',
    'hyperswarm',
    'hyperdht',
    'crc-native',
    'fs-native-extensions',
    'quickbit-native',
    'simdle-native'
  ]
};

module.exports = nextConfig; 