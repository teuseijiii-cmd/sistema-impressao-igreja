
ARQUIVO: 13. frontend/vite.config.ts<br/>
CAMINHO: frontend/vite.config.ts<br/>
DESCRIÇÃO: Configuração do Vite

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],<br/>
  server: {<br/>
    port: 5173,<br/>
    proxy: {<br/>
      '/api': {<br/>
        target: 'http://localhost:3000',<br/>
        changeOrigin: true,<br/>
        secure: false,
      }
    }
  },
  build: {<br/>
    outDir: 'dist',<br/>
    sourcemap: true,
  }
});
