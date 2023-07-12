/** @type {import('next').NextConfig} */

module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `stream` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: require.resolve("stream-browserify"),
      };
    }

    return config;
  },
};
