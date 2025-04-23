// let userConfig = undefined
// try {
//   userConfig = (await import('./v0-user-next.config')).default
// } catch (e) {
//   // ignore if that file doesn’t exist
// }

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,   // only keep this if you really need it
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      dns: false,
      fs: false,
    }
    return config
  },
}

// mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return
  for (const key in userConfig) {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = { ...nextConfig[key], ...userConfig[key] }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
