import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Los datos del diagrama vienen del endpoint /api/flujo-sheets del workapp
// (NestJS, workapp/server/src/flujo-diagrama/). La URL se configura con
// VITE_SHEETS_API_URL en .env; para apuntar a un workapp local usar .env.local.
export default defineConfig({
  plugins: [react()],
});
