import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // Ensures relative paths for assets, making it easier to deploy on any static host
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    }
});
