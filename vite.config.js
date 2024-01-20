import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
          input: {
            main: 'src/main.tsx', // Assuming your main entry file is a TypeScript file
            html: 'index.html',
          },
        },
      },
});
//# sourceMappingURL=vite.config.js.map