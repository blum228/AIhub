// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Для GitHub Pages с подпапкой (замени на свой репозиторий)
  site: 'https://blum228.github.io/ids-astro',
  base: '/ids-astro',
  output: 'static',
});
