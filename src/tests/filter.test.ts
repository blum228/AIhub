/**
 * **Feature: sng-redesign, Property 1: Filter returns only matching services**
 * **Validates: Requirements 1.2, 1.3, 1.4, 1.5**
 * 
 * **Feature: sng-redesign, Property 6: Dead filter exclusion**
 * **Validates: Requirements 5.5**
 * 
 * Property tests для логики фильтрации
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Типы для сервиса
interface Service {
  slug: string;
  name: string;
  pricing: 'free' | 'freemium' | 'paid';
  status: 'active' | 'dead' | 'censored';
  vpn_required: boolean;
  payment_methods: ('mir' | 'sbp' | 'crypto' | 'foreign_card')[];
  platforms: ('web' | 'ios' | 'android' | 'telegram')[];
  features: {
    nsfw?: boolean;
    russian?: boolean;
    voice?: boolean;
    telegram?: boolean;
    roleplay?: boolean;
  };
  advancedFeatures?: {
    memoryType?: 'none' | 'short' | 'long' | 'persistent';
  };
}

interface FilterState {
  meaning: string[];
  features: string[];
  platform: string[];
  payment: string[];
  showDead: boolean;
}

// Функция фильтрации (логика из catalog.astro)
function filterServices(services: Service[], filters: FilterState): Service[] {
  return services.filter(service => {
    // Requirement 5.5: Исключаем dead если showDead = false
    if (!filters.showDead && (service.status === 'dead' || service.status === 'censored')) {
      return false;
    }

    // Requirement 1.2: Фильтр "Оплата картой РФ"
    if (filters.payment.includes('mir')) {
      if (!service.payment_methods.includes('mir') && !service.payment_methods.includes('sbp')) {
        return false;
      }
    }

    // Requirement 1.3: Фильтр "Без VPN"
    if (filters.features.includes('no-vpn')) {
      if (service.vpn_required) {
        return false;
      }
    }

    // Requirement 1.4: Фильтр "Telegram"
    if (filters.platform.includes('telegram')) {
      if (!service.platforms.includes('telegram')) {
        return false;
      }
    }

    // Фильтр по платформам (AND логика)
    for (const platform of filters.platform) {
      if (!service.platforms.includes(platform as any)) {
        return false;
      }
    }

    // Фильтр по способам оплаты
    if (filters.payment.includes('free')) {
      if (service.pricing !== 'free') {
        return false;
      }
    }

    if (filters.payment.includes('crypto')) {
      if (!service.payment_methods.includes('crypto')) {
        return false;
      }
    }

    // Фильтр по смыслу
    if (filters.meaning.includes('nsfw')) {
      if (!service.features.nsfw) {
        return false;
      }
    }

    if (filters.meaning.includes('roleplay')) {
      if (!service.features.roleplay) {
        return false;
      }
    }

    // Фильтр по фичам
    if (filters.features.includes('memory')) {
      if (service.advancedFeatures?.memoryType !== 'persistent') {
        return false;
      }
    }

    if (filters.features.includes('voice')) {
      if (!service.features.voice) {
        return false;
      }
    }

    if (filters.features.includes('russian')) {
      if (!service.features.russian) {
        return false;
      }
    }

    return true;
  });
}

// Генераторы
const pricingArb = fc.constantFrom('free', 'freemium', 'paid') as fc.Arbitrary<'free' | 'freemium' | 'paid'>;
const statusArb = fc.constantFrom('active', 'dead', 'censored') as fc.Arbitrary<'active' | 'dead' | 'censored'>;
const paymentMethodArb = fc.constantFrom('mir', 'sbp', 'crypto', 'foreign_card') as fc.Arbitrary<'mir' | 'sbp' | 'crypto' | 'foreign_card'>;
const platformArb = fc.constantFrom('web', 'ios', 'android', 'telegram') as fc.Arbitrary<'web' | 'ios' | 'android' | 'telegram'>;
const memoryTypeArb = fc.constantFrom('none', 'short', 'long', 'persistent') as fc.Arbitrary<'none' | 'short' | 'long' | 'persistent'>;

const serviceArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  pricing: pricingArb,
  status: statusArb,
  vpn_required: fc.boolean(),
  payment_methods: fc.array(paymentMethodArb, { maxLength: 4 }),
  platforms: fc.array(platformArb, { minLength: 1, maxLength: 4 }),
  features: fc.record({
    nsfw: fc.boolean(),
    russian: fc.boolean(),
    voice: fc.boolean(),
    telegram: fc.boolean(),
    roleplay: fc.boolean(),
  }),
  advancedFeatures: fc.option(fc.record({
    memoryType: memoryTypeArb,
  }), { nil: undefined }),
});

const filterStateArb = fc.record({
  meaning: fc.subarray(['nsfw', 'roleplay', 'psychology']),
  features: fc.subarray(['memory', 'image-gen', 'voice', 'scenario', 'russian', 'no-vpn']),
  platform: fc.subarray(['web', 'ios', 'android', 'telegram']),
  payment: fc.subarray(['free', 'mir', 'crypto']),
  showDead: fc.boolean(),
});

describe('Filter Logic (Property 1)', () => {
  // Requirement 1.5: AND логика для всех фильтров
  it('property: filtered results satisfy ALL selected conditions', () => {
    fc.assert(
      fc.property(
        fc.array(serviceArb, { minLength: 1, maxLength: 20 }),
        filterStateArb,
        (services, filters) => {
          const results = filterServices(services, filters);
          
          // Каждый результат должен удовлетворять всем условиям
          return results.every(service => {
            // Проверяем dead фильтр
            if (!filters.showDead && (service.status === 'dead' || service.status === 'censored')) {
              return false;
            }

            // Проверяем платформы
            for (const platform of filters.platform) {
              if (!service.platforms.includes(platform as any)) {
                return false;
              }
            }

            // Проверяем оплату
            if (filters.payment.includes('free') && service.pricing !== 'free') {
              return false;
            }

            if (filters.payment.includes('mir')) {
              if (!service.payment_methods.includes('mir') && !service.payment_methods.includes('sbp')) {
                return false;
              }
            }

            if (filters.payment.includes('crypto') && !service.payment_methods.includes('crypto')) {
              return false;
            }

            // Проверяем смысл
            if (filters.meaning.includes('nsfw') && !service.features.nsfw) {
              return false;
            }

            if (filters.meaning.includes('roleplay') && !service.features.roleplay) {
              return false;
            }

            // Проверяем фичи
            if (filters.features.includes('memory') && service.advancedFeatures?.memoryType !== 'persistent') {
              return false;
            }

            if (filters.features.includes('voice') && !service.features.voice) {
              return false;
            }

            if (filters.features.includes('russian') && !service.features.russian) {
              return false;
            }

            if (filters.features.includes('no-vpn') && service.vpn_required) {
              return false;
            }

            return true;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // Requirement 1.2: Фильтр "Оплата картой РФ"
  it('property: mir filter returns only services with mir or sbp payment', () => {
    fc.assert(
      fc.property(
        fc.array(serviceArb, { minLength: 1, maxLength: 20 }),
        (services) => {
          const filters: FilterState = {
            meaning: [],
            features: [],
            platform: [],
            payment: ['mir'],
            showDead: true,
          };
          
          const results = filterServices(services, filters);
          return results.every(s => 
            s.payment_methods.includes('mir') || s.payment_methods.includes('sbp')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  // Requirement 1.4: Фильтр "Telegram"
  it('property: telegram filter returns only services with telegram platform', () => {
    fc.assert(
      fc.property(
        fc.array(serviceArb, { minLength: 1, maxLength: 20 }),
        (services) => {
          const filters: FilterState = {
            meaning: [],
            features: [],
            platform: ['telegram'],
            payment: [],
            showDead: true,
          };
          
          const results = filterServices(services, filters);
          return results.every(s => s.platforms.includes('telegram'));
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Dead Filter Exclusion (Property 6)', () => {
  // Requirement 5.5: showDead = false исключает dead сервисы
  it('property: showDead=false excludes all dead and censored services', () => {
    fc.assert(
      fc.property(
        fc.array(serviceArb, { minLength: 1, maxLength: 20 }),
        (services) => {
          const filters: FilterState = {
            meaning: [],
            features: [],
            platform: [],
            payment: [],
            showDead: false,
          };
          
          const results = filterServices(services, filters);
          return results.every(s => s.status === 'active');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: showDead=true includes dead and censored services', () => {
    fc.assert(
      fc.property(
        fc.array(serviceArb, { minLength: 1, maxLength: 20 }),
        (services) => {
          const filters: FilterState = {
            meaning: [],
            features: [],
            platform: [],
            payment: [],
            showDead: true,
          };
          
          const results = filterServices(services, filters);
          const deadInInput = services.filter(s => s.status !== 'active').length;
          const deadInResults = results.filter(s => s.status !== 'active').length;
          
          // Если были dead сервисы во входных данных, они должны быть в результатах
          return deadInInput === 0 || deadInResults > 0 || deadInInput === deadInResults;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('specific: dead services are excluded when showDead=false', () => {
    const services: Service[] = [
      {
        slug: 'active-service',
        name: 'Active',
        pricing: 'free',
        status: 'active',
        vpn_required: false,
        payment_methods: [],
        platforms: ['web'],
        features: {},
      },
      {
        slug: 'dead-service',
        name: 'Dead',
        pricing: 'free',
        status: 'dead',
        vpn_required: false,
        payment_methods: [],
        platforms: ['web'],
        features: {},
      },
    ];

    const filters: FilterState = {
      meaning: [],
      features: [],
      platform: [],
      payment: [],
      showDead: false,
    };

    const results = filterServices(services, filters);
    expect(results).toHaveLength(1);
    expect(results[0].slug).toBe('active-service');
  });
});
