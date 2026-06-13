import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true, // bind to all interfaces (0.0.0.0 + ::) so VS Code / dev-container IPv4 port forwarding reaches it
  },
})
