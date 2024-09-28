import { defineConfig } from 'vite';
import vercel from 'vite-plugin-vercel';
import react from '@vitejs/plugin-react'

export default defineConfig({
    define: {
      __APP_ENV__: process.env.VITE_VERCEL_ENV,
    },
    plugins: [vercel(),react()],
});
