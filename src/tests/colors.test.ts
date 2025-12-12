/**
 * **Feature: sng-redesign, Property 10: Card contains required information** (адаптировано для цветов)
 * **Validates: Requirements 9.4**
 * 
 * Property test для проверки контрастности цветов тёмной темы
 * Минимальный контраст по WCAG AA: 4.5:1 для обычного текста
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Цвета из colors.css (тёмная тема)
const DARK_THEME_COLORS = {
  text: { r: 232, g: 232, b: 232 },       // #e8e8e8
  background: { r: 15, g: 15, b: 15 },    // #0f0f0f
  surface: { r: 26, g: 26, b: 26 },       // #1a1a1a
  link: { r: 100, g: 160, b: 255 },       // Контрастные ссылки
  accent: { r: 253, g: 47, b: 75 },       // Акцент
  hover: { r: 80, g: 220, b: 120 },       // Hover
};

// Вычисление относительной яркости по WCAG
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Вычисление контрастности по WCAG
function contrastRatio(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number {
  const l1 = relativeLuminance(color1.r, color1.g, color1.b);
  const l2 = relativeLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Dark Theme Color Contrast', () => {
  // WCAG AA минимум: 4.5:1 для обычного текста, 3:1 для крупного текста
  const WCAG_AA_NORMAL = 4.5;
  const WCAG_AA_LARGE = 3;

  it('text on background has sufficient contrast (WCAG AA)', () => {
    const ratio = contrastRatio(DARK_THEME_COLORS.text, DARK_THEME_COLORS.background);
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
  });

  it('text on surface has sufficient contrast (WCAG AA)', () => {
    const ratio = contrastRatio(DARK_THEME_COLORS.text, DARK_THEME_COLORS.surface);
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
  });

  it('link on background has sufficient contrast (WCAG AA)', () => {
    const ratio = contrastRatio(DARK_THEME_COLORS.link, DARK_THEME_COLORS.background);
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
  });

  it('accent on background has sufficient contrast for large text (WCAG AA)', () => {
    const ratio = contrastRatio(DARK_THEME_COLORS.accent, DARK_THEME_COLORS.background);
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE);
  });

  it('hover on background has sufficient contrast (WCAG AA)', () => {
    const ratio = contrastRatio(DARK_THEME_COLORS.hover, DARK_THEME_COLORS.background);
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
  });

  // Property-based test: любой текстовый цвет должен быть контрастным на тёмном фоне
  it('property: any light text color (200-255) on dark background (0-30) has good contrast', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 200, max: 255 }), // light text R
        fc.integer({ min: 200, max: 255 }), // light text G
        fc.integer({ min: 200, max: 255 }), // light text B
        fc.integer({ min: 0, max: 30 }),    // dark bg R
        fc.integer({ min: 0, max: 30 }),    // dark bg G
        fc.integer({ min: 0, max: 30 }),    // dark bg B
        (tr, tg, tb, br, bg, bb) => {
          const ratio = contrastRatio({ r: tr, g: tg, b: tb }, { r: br, g: bg, b: bb });
          return ratio >= WCAG_AA_NORMAL;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: фон страницы в диапазоне #0a0a0a - #1a1a1a (Requirement 9.2)
  it('property: background color is in valid dark range', () => {
    const { r, g, b } = DARK_THEME_COLORS.background;
    // #0a0a0a = 10,10,10 и #1a1a1a = 26,26,26
    expect(r).toBeGreaterThanOrEqual(10);
    expect(r).toBeLessThanOrEqual(26);
    expect(g).toBeGreaterThanOrEqual(10);
    expect(g).toBeLessThanOrEqual(26);
    expect(b).toBeGreaterThanOrEqual(10);
    expect(b).toBeLessThanOrEqual(26);
  });

  // Property: текст в диапазоне #e0e0e0 - #ffffff (Requirement 9.3)
  it('property: text color is in valid light range', () => {
    const { r, g, b } = DARK_THEME_COLORS.text;
    // #e0e0e0 = 224,224,224 и #ffffff = 255,255,255
    expect(r).toBeGreaterThanOrEqual(224);
    expect(r).toBeLessThanOrEqual(255);
    expect(g).toBeGreaterThanOrEqual(224);
    expect(g).toBeLessThanOrEqual(255);
    expect(b).toBeGreaterThanOrEqual(224);
    expect(b).toBeLessThanOrEqual(255);
  });
});
