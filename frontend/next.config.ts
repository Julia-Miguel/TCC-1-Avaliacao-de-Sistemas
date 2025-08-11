// frontend/next.config.ts

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sua configuração do Next.js (se tiver alguma) entra aqui.
  // Por enquanto, pode deixar vazio.
};

module.exports = withBundleAnalyzer(nextConfig)