import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // The contact form posts to VITE_FORMSUBMIT_URL. A production build without it ships a
  // form that can never send (this happened in production), so fail the build instead.
  if (command === 'build' && mode === 'production') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    if (!/^https:\/\/formsubmit\.co\/ajax\/\S+$/.test(env.VITE_FORMSUBMIT_URL || '')) {
      throw new Error(
        'VITE_FORMSUBMIT_URL is missing or not a https://formsubmit.co/ajax/... URL. ' +
          'Set it in .env.production (committed) or in the build environment.',
      )
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true, // bind to all interfaces (0.0.0.0 + ::) so VS Code / dev-container IPv4 port forwarding reaches it
    },
    build: {
      // Fonts are never inlined as data: URIs: the CSP is `font-src 'self'`, which refuses them.
      // (Fontsource ships a few tiny subsets, such as JetBrains Mono cyrillic-ext at 2 KB,
      // that Vite would otherwise inline.)
      assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined),
    },
  }
})
