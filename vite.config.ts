import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// The production app loads its scripts, fonts and images locally. Inline CSS is
// required by React/Motion; inline scripts and eval remain forbidden.
const contentSecurityPolicy = [
  "default-src 'none'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'",
  "worker-src 'none'",
].join('; ')

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'production-security-policy',
      transformIndexHtml: {
        order: 'post',
        handler(_html, context) {
          // Vite's development client needs HMR connections and inline scripts.
          if (context.server) return []
          return [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy }, injectTo: 'head-prepend' }]
        },
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    fs: {
      strict: true,
      deny: ['.env', '.env.*', '*.{crt,pem,key}', '**/.git/**', '**/.agents/**', '**/.codex/**', '**/.npm-security-cache/**', '**/outputs/**', '**/scripts/**'],
    },
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  preview: {
    host: '127.0.0.1',
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': `${contentSecurityPolicy}; frame-ancestors 'none'`,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
})
