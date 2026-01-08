import { defineConfig } from 'vitest/config'; 

export default defineConfig({
  test: {
    // Vitest specific options here
    globals: true,
    environment: 'jsdom', // or 'happy-dom'
  },
});