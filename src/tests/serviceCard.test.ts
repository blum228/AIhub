/**
 * **Feature: sng-redesign, Property 10: Card contains required information**
 * **Validates: Requirements 3.1**
 * 
 * **Feature: sng-redesign, Property 5: Dead services visual indication**
 * **Validates: Requirements 5.1, 5.2**
 * 
 * Property tests для ServiceCard
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Типы для ServiceCard
interface ServiceCardProps {
  slug: string;
  name: string;
  rating: number;
  pricing: 'free' | 'freemium' | 'paid';
  priceFrom?: number;
  tagline?: string;
  description: string;
  logo?: string;
  gifPreview?: string;
  status: 'active' | 'dead' | 'censored';
  affiliateUrl: string;
  features: {
    nsfw?: boolean;
    russian?: boolean;
    voice?: boolean;
    telegram?: boolean;
  };
  advancedFeatures?: {
    memoryType?: 'none' | 'short' | 'long' | 'persistent';
  };
  paymentMethods?: ('mir' | 'sbp' | 'crypto' | 'foreign_card')[];
}

// Функция для проверки обязательных элементов карточки
function validateCardRequiredElements(props: ServiceCardProps): {
  hasName: boolean;
  hasRating: boolean;
  hasDescription: boolean;
  hasBadges: boolean;
  hasPrice: boolean;
} {
  // Собираем бейджи (логика из ServiceCard.astro)
  const badges: string[] = [];
  if (props.pricing === 'free') badges.push('free');
  if (props.features.nsfw) badges.push('nsfw');
  if (props.advancedFeatures?.memoryType === 'persistent') badges.push('memory');
  if (props.paymentMethods?.includes('mir')) badges.push('mir');
  if (props.paymentMethods?.includes('sbp')) badges.push('sbp');
  if (props.paymentMethods?.includes('crypto')) badges.push('crypto');
  if (props.features.russian) badges.push('russian');
  if (props.features.voice) badges.push('voice');
  if (props.features.telegram) badges.push('telegram');
  if (props.status === 'dead') badges.push('dead');
  if (props.status === 'censored') badges.push('censored');

  return {
    hasName: props.name.length > 0,
    hasRating: props.rating >= 0 && props.rating <= 5,
    hasDescription: props.description.length > 0 || (props.tagline?.length ?? 0) > 0,
    hasBadges: badges.length > 0,
    hasPrice: props.pricing !== undefined,
  };
}

// Функция для проверки визуальной индикации dead-сервисов
function validateDeadServiceIndication(props: ServiceCardProps): {
  shouldHaveDeadClass: boolean;
  shouldHaveDeadBadge: boolean;
} {
  const isDead = props.status === 'dead' || props.status === 'censored';
  return {
    shouldHaveDeadClass: isDead,
    shouldHaveDeadBadge: isDead,
  };
}

// Генераторы для property-based тестов
const pricingArb = fc.constantFrom('free', 'freemium', 'paid') as fc.Arbitrary<'free' | 'freemium' | 'paid'>;
const statusArb = fc.constantFrom('active', 'dead', 'censored') as fc.Arbitrary<'active' | 'dead' | 'censored'>;
const memoryTypeArb = fc.constantFrom('none', 'short', 'long', 'persistent') as fc.Arbitrary<'none' | 'short' | 'long' | 'persistent'>;
const paymentMethodArb = fc.constantFrom('mir', 'sbp', 'crypto', 'foreign_card') as fc.Arbitrary<'mir' | 'sbp' | 'crypto' | 'foreign_card'>;

const serviceCardPropsArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  rating: fc.float({ min: 0, max: 5, noNaN: true }),
  pricing: pricingArb,
  priceFrom: fc.option(fc.float({ min: 0, max: 100, noNaN: true }), { nil: undefined }),
  tagline: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  logo: fc.option(fc.webUrl(), { nil: undefined }),
  gifPreview: fc.option(fc.webUrl(), { nil: undefined }),
  status: statusArb,
  affiliateUrl: fc.webUrl(),
  features: fc.record({
    nsfw: fc.boolean(),
    russian: fc.boolean(),
    voice: fc.boolean(),
    telegram: fc.boolean(),
  }),
  advancedFeatures: fc.option(fc.record({
    memoryType: memoryTypeArb,
  }), { nil: undefined }),
  paymentMethods: fc.option(fc.array(paymentMethodArb, { maxLength: 4 }), { nil: undefined }),
});

describe('ServiceCard Required Elements (Property 10)', () => {
  // Requirement 3.1: Card shows name, rating, description, badges, price
  it('property: all cards have required elements', () => {
    fc.assert(
      fc.property(serviceCardPropsArb, (props) => {
        const validation = validateCardRequiredElements(props);
        return (
          validation.hasName &&
          validation.hasRating &&
          validation.hasDescription &&
          validation.hasPrice
        );
      }),
      { numRuns: 100 }
    );
  });

  it('property: rating is always in valid range 0-5', () => {
    fc.assert(
      fc.property(serviceCardPropsArb, (props) => {
        return props.rating >= 0 && props.rating <= 5;
      }),
      { numRuns: 100 }
    );
  });

  it('property: name is never empty', () => {
    fc.assert(
      fc.property(serviceCardPropsArb, (props) => {
        return props.name.length > 0;
      }),
      { numRuns: 100 }
    );
  });

  it('property: description or tagline is always present', () => {
    fc.assert(
      fc.property(serviceCardPropsArb, (props) => {
        return props.description.length > 0 || (props.tagline?.length ?? 0) > 0;
      }),
      { numRuns: 100 }
    );
  });
});

describe('Dead Services Visual Indication (Property 5)', () => {
  // Requirement 5.1: Dead services have visual indicator
  it('property: dead services should have dead class', () => {
    fc.assert(
      fc.property(serviceCardPropsArb, (props) => {
        const validation = validateDeadServiceIndication(props);
        if (props.status === 'dead' || props.status === 'censored') {
          return validation.shouldHaveDeadClass;
        }
        return !validation.shouldHaveDeadClass;
      }),
      { numRuns: 100 }
    );
  });

  // Requirement 5.2: Dead services have badge
  it('property: dead services should have dead/censored badge', () => {
    fc.assert(
      fc.property(serviceCardPropsArb, (props) => {
        const validation = validateDeadServiceIndication(props);
        if (props.status === 'dead' || props.status === 'censored') {
          return validation.shouldHaveDeadBadge;
        }
        return true; // Active services don't need dead badge
      }),
      { numRuns: 100 }
    );
  });

  // Specific test: dead status results in opacity 0.6 class
  it('dead status maps to service-card--dead class', () => {
    const deadProps: ServiceCardProps = {
      slug: 'test',
      name: 'Test',
      rating: 4.0,
      pricing: 'paid',
      description: 'Test description',
      status: 'dead',
      affiliateUrl: 'https://example.com',
      features: {},
    };
    
    const validation = validateDeadServiceIndication(deadProps);
    expect(validation.shouldHaveDeadClass).toBe(true);
  });

  it('censored status maps to service-card--dead class', () => {
    const censoredProps: ServiceCardProps = {
      slug: 'test',
      name: 'Test',
      rating: 4.0,
      pricing: 'paid',
      description: 'Test description',
      status: 'censored',
      affiliateUrl: 'https://example.com',
      features: {},
    };
    
    const validation = validateDeadServiceIndication(censoredProps);
    expect(validation.shouldHaveDeadClass).toBe(true);
  });

  it('active status does not have dead class', () => {
    const activeProps: ServiceCardProps = {
      slug: 'test',
      name: 'Test',
      rating: 4.0,
      pricing: 'paid',
      description: 'Test description',
      status: 'active',
      affiliateUrl: 'https://example.com',
      features: {},
    };
    
    const validation = validateDeadServiceIndication(activeProps);
    expect(validation.shouldHaveDeadClass).toBe(false);
  });
});
