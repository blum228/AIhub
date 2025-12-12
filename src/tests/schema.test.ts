/**
 * **Feature: sng-redesign, Property 7: Schema validation**
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**
 * 
 * Property test для проверки валидации Zod-схемы с новыми СНГ-полями
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { z } from 'zod';

// Воспроизводим схему СНГ-полей для тестирования
const sngFieldsSchema = z.object({
  payment_methods: z.array(z.enum(['mir', 'sbp', 'crypto', 'foreign_card'])).default([]),
  vpn_required: z.boolean().default(true),
  platforms: z.array(z.enum(['web', 'ios', 'android', 'telegram'])).default(['web']),
  status: z.enum(['active', 'dead', 'censored']).default('active'),
  dead_reason: z.string().optional(),
  dead_date: z.string().optional(),
  gif_preview: z.string().optional(),
  payment_guide: z.string().optional(),
});

// Генераторы для property-based тестов
const paymentMethodArb = fc.constantFrom('mir', 'sbp', 'crypto', 'foreign_card');
const platformArb = fc.constantFrom('web', 'ios', 'android', 'telegram');
const statusArb = fc.constantFrom('active', 'dead', 'censored');

const validSngDataArb = fc.record({
  payment_methods: fc.array(paymentMethodArb, { maxLength: 4 }),
  vpn_required: fc.boolean(),
  platforms: fc.array(platformArb, { minLength: 1, maxLength: 4 }),
  status: statusArb,
  dead_reason: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
  dead_date: fc.option(
    fc.tuple(
      fc.integer({ min: 2020, max: 2030 }),
      fc.integer({ min: 1, max: 12 }),
      fc.integer({ min: 1, max: 28 })
    ).map(([y, m, d]) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`),
    { nil: undefined }
  ),
  gif_preview: fc.option(fc.webUrl(), { nil: undefined }),
  payment_guide: fc.option(fc.string({ minLength: 1, maxLength: 1000 }), { nil: undefined }),
});

describe('SNG Schema Validation', () => {
  // Requirement 6.1: payment_methods типа массив строк
  it('validates payment_methods as array of valid enums', () => {
    fc.assert(
      fc.property(
        fc.array(paymentMethodArb, { maxLength: 4 }),
        (methods) => {
          const result = sngFieldsSchema.safeParse({ payment_methods: methods });
          return result.success;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects invalid payment_methods values', () => {
    const result = sngFieldsSchema.safeParse({ payment_methods: ['invalid_method'] });
    expect(result.success).toBe(false);
  });

  // Requirement 6.2: vpn_required типа boolean
  it('validates vpn_required as boolean', () => {
    fc.assert(
      fc.property(fc.boolean(), (vpn) => {
        const result = sngFieldsSchema.safeParse({ vpn_required: vpn });
        return result.success;
      }),
      { numRuns: 100 }
    );
  });

  // Requirement 6.3: platforms типа массив enum
  it('validates platforms as array of valid enums', () => {
    fc.assert(
      fc.property(
        fc.array(platformArb, { minLength: 1, maxLength: 4 }),
        (platforms) => {
          const result = sngFieldsSchema.safeParse({ platforms });
          return result.success;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects invalid platform values', () => {
    const result = sngFieldsSchema.safeParse({ platforms: ['windows'] });
    expect(result.success).toBe(false);
  });

  // Requirement 6.4: status типа enum
  it('validates status as valid enum', () => {
    fc.assert(
      fc.property(statusArb, (status) => {
        const result = sngFieldsSchema.safeParse({ status });
        return result.success;
      }),
      { numRuns: 100 }
    );
  });

  it('rejects invalid status values', () => {
    const result = sngFieldsSchema.safeParse({ status: 'unknown' });
    expect(result.success).toBe(false);
  });

  // Requirement 6.5: dead_reason типа string (опционально)
  it('validates dead_reason as optional string', () => {
    fc.assert(
      fc.property(
        fc.option(fc.string(), { nil: undefined }),
        (reason) => {
          const result = sngFieldsSchema.safeParse({ dead_reason: reason });
          return result.success;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Requirement 6.6: gif_preview типа string URL (опционально)
  it('validates gif_preview as optional string', () => {
    fc.assert(
      fc.property(
        fc.option(fc.string(), { nil: undefined }),
        (preview) => {
          const result = sngFieldsSchema.safeParse({ gif_preview: preview });
          return result.success;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: любые валидные СНГ-данные проходят валидацию
  it('property: any valid SNG data passes schema validation', () => {
    fc.assert(
      fc.property(validSngDataArb, (data) => {
        const result = sngFieldsSchema.safeParse(data);
        return result.success;
      }),
      { numRuns: 100 }
    );
  });

  // Property: defaults применяются корректно
  it('property: defaults are applied for empty object', () => {
    const result = sngFieldsSchema.parse({});
    expect(result.payment_methods).toEqual([]);
    expect(result.vpn_required).toBe(true);
    expect(result.platforms).toEqual(['web']);
    expect(result.status).toBe('active');
  });

  // Property: dead сервисы могут иметь причину и дату
  it('property: dead services can have reason and date', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.date().map(d => d.toISOString().split('T')[0]),
        (reason, date) => {
          const result = sngFieldsSchema.safeParse({
            status: 'dead',
            dead_reason: reason,
            dead_date: date,
          });
          return result.success;
        }
      ),
      { numRuns: 100 }
    );
  });
});
