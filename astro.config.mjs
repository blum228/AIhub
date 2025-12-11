// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Для GitHub Pages с подпапкой
  site: 'https://blum228.github.io/AIhub',
  base: '/AIhub',
  output: 'static',
});
