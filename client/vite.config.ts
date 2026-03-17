import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL?.trim()
  console.log(`Vite config loaded with API URL: ${apiUrl}`)
  return {
    resolve: {
      preserveSymlinks: true,
    },
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  }
})
