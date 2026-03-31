import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Mantiene el comportamiento esperado para pruebas con Angular (TestBed) y componentes.
        globals: true,
        environment: 'jsdom',
    },
});