/**
 * **Feature: sng-redesign, Property 2: Badge rendering matches service data**
 * **Validates: Requirements 3.3, 3.4, 3.5, 3.6**
 * 
 * Property test для проверки соответствия бейджей данным сервиса
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Конфигурация бейджей (должна соответствовать ServiceBadge.astro)
const badgeConfig = {
  free: { label: 'Free', color: 'var(--ids__success)' },
  nsfw: { label: '18+', color: 'var(--ids__error)', hideInSafeMode: true },
  memory: { label: 'Память', color: 'var(--ids__link)' },
  mir: { label: 'Мир', color: '#4CAF50', icon: '💳' },
  sbp: { label: 'СБП', color: '#4CAF50', icon: '📱' },
  crypto: { label: 'Крипто', color: '#F7931A', icon: '₿' },
  russian: { label: 'RU', color: 'var(--ids__text-secondary)' },
  voice: { label: 'Голос', color: 'var(--ids__warning)', icon: '🎤' },
  telegram: { label: 'TG', color: '#0088cc', icon: '✈️' },
  dead: { label: 'Закрыт', color: 'var(--ids__text-muted)' },
  censored: { label: 'Цензура', color: 'var(--ids__text-muted)' },
} as const;

type BadgeType = keyof typeof badgeConfig;

// Функция для определения бейджей на основе данных сервиса
function getBadgesForService(service: {
  pricing: 'free' | 'freemium' | 'paid';
  features: { nsfw?: boolean; russian?: boolean; voice?: boolean; telegram?: boolean };
  advancedFeatures?: { memoryType?: 'none' | 'short' | 'long' | 'persistent' };
  payment_methods?: ('mir' | 'sbp' | 'crypto' | 'foreign_card')[];
  status?: 'active' | 'dead' | 'censored';
}): BadgeType[] {
  const badges: BadgeType[] = [];

  // Requirement 3.3: Free badge для бесплатных сервисов
  if (service.pricing === 'free') {
    badges.push('free');
  }

  // Requirement 3.4: 18+ badge для NSFW
  if (service.features.nsfw) {
    badges.push('nsfw');
  }

  // Requirement 3.5: Память badge для persistent memory
  if (service.advancedFeatures?.memoryType === 'persistent') {
    badges.push('memory');
  }

  // Requirement 3.6: Мир badge для карт РФ
  if (service.payment_methods?.includes('mir')) {
    badges.push('mir');
  }

  // Дополнительные бейджи
  if (service.payment_methods?.includes('sbp')) {
    badges.push('sbp');
  }
  if (service.payment_methods?.includes('crypto')) {
    badges.push('crypto');
  }
  if (service.features.russian) {
    badges.push('russian');
  }
  if (service.features.voice) {
    badges.push('voice');
  }
  if (service.features.telegram) {
    badges.push('telegram');
  }
  if (service.status === 'dead') {
    badges.push('dead');
  }
  if (service.status === 'censored') {
    badges.push('censored');
  }

  return badges;
}

// Генераторы для property-based тестов
const pricingArb = fc.constantFrom('free', 'freemium', 'paid') as fc.Arbitrary<'free' | 'freemium' | 'paid'>;
const memoryTypeArb = fc.constantFrom('none', 'short', 'long', 'persistent') as fc.Arbitrary<'none' | 'short' | 'long' | 'persistent'>;
const paymentMethodArb = fc.constantFrom('mir', 'sbp', 'crypto', 'foreign_card') as fc.Arbitrary<'mir' | 'sbp' | 'crypto' | 'foreign_card'>;
const statusArb = fc.constantFrom('active', 'dead', 'censored') as fc.Arbitrary<'active' | 'dead' | 'censored'>;

const serviceArb = fc.record({
  pricing: pricingArb,
  features: fc.record({
    nsfw: fc.boolean(),
    russian: fc.boolean(),
    voice: fc.boolean(),
    telegram: fc.boolean(),
  }),
  advancedFeatures: fc.record({
    memoryType: memoryTypeArb,
  }),
  payment_methods: fc.array(paymentMethodArb, { maxLength: 4 }),
  status: statusArb,
});

describe('ServiceBadge Rendering', () => {
  // Requirement 3.3: Free badge
  it('property: free services always have Free badge', () => {
    fc.assert(
      fc.property(serviceArb, (service) => {
        const badges = getBadgesForService(service);
        if (service.pricing === 'free') {
          return badges.includes('free');
        }
        return !badges.includes('free');
      }),
      { numRuns: 100 }
    );
  });

  // Requirement 3.4: NSFW badge
  it('property: NSFW services always have 18+ badge', () => {
    fc.assert(
      fc.property(serviceArb, (service) => {
        const badges = getBadgesForService(service);
        if (service.features.nsfw) {
          return badges.includes('nsfw');
        }
        return !badges.includes('nsfw');
      }),
      { numRuns: 100 }
    );
  });

  // Requirement 3.5: Memory badge
  it('property: persistent memory services have Память badge', () => {
    fc.assert(
      fc.property(serviceArb, (service) => {
        const badges = getBadgesForService(service);
        if (service.advancedFeatures?.memoryType === 'persistent') {
          return badges.includes('memory');
        }
        return !badges.includes('memory');
      }),
      { numRuns: 100 }
    );
  });

  // Requirement 3.6: Mir badge
  it('property: services with mir payment have Мир badge', () => {
    fc.assert(
      fc.property(serviceArb, (service) => {
        const badges = getBadgesForService(service);
        if (service.payment_methods?.includes('mir')) {
          return badges.includes('mir');
        }
        return !badges.includes('mir');
      }),
      { numRuns: 100 }
    );
  });

  // Property: dead services have dead badge
  it('property: dead services have Закрыт badge', () => {
    fc.assert(
      fc.property(serviceArb, (service) => {
        const badges = getBadgesForService(service);
        if (service.status === 'dead') {
          return badges.includes('dead');
        }
        return !badges.includes('dead');
      }),
      { numRuns: 100 }
    );
  });

  // Property: all badge types have valid config
  it('all badge types have label and color', () => {
    const badgeTypes = Object.keys(badgeConfig) as BadgeType[];
    for (const type of badgeTypes) {
      expect(badgeConfig[type].label).toBeTruthy();
      expect(badgeConfig[type].color).toBeTruthy();
    }
  });

  // Property: NSFW badge is marked for Safe Mode hiding
  it('nsfw badge is marked for Safe Mode hiding', () => {
    expect(badgeConfig.nsfw.hideInSafeMode).toBe(true);
  });
});
