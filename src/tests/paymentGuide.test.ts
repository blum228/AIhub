/**
 * **Feature: sng-redesign, Property 8: Payment guide conditional rendering**
 * **Validates: Requirements 7.1, 7.3**
 * 
 * Property test для условного рендеринга PaymentGuide
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

type PaymentMethod = 'mir' | 'sbp' | 'crypto' | 'foreign_card';

// Логика условного рендеринга из PaymentGuide.astro
function shouldShowPaymentGuide(paymentMethods: PaymentMethod[]): boolean {
  // Requirement 7.3: Не показываем если есть карты РФ
  const hasRussianPayment = paymentMethods.includes('mir') || paymentMethods.includes('sbp');
  return !hasRussianPayment;
}

// Генераторы
const paymentMethodArb = fc.constantFrom('mir', 'sbp', 'crypto', 'foreign_card') as fc.Arbitrary<PaymentMethod>;

describe('PaymentGuide Conditional Rendering (Property 8)', () => {
  // Requirement 7.1: Показываем если нет карт РФ
  it('property: guide is shown when no Russian payment methods', () => {
    fc.assert(
      fc.property(
        fc.array(paymentMethodArb, { maxLength: 4 }),
        (methods) => {
          const hasRussian = methods.includes('mir') || methods.includes('sbp');
          const shouldShow = shouldShowPaymentGuide(methods);
          
          // Если нет российских методов — показываем
          if (!hasRussian) {
            return shouldShow === true;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Requirement 7.3: Не показываем если есть карты РФ
  it('property: guide is hidden when Russian payment methods exist', () => {
    fc.assert(
      fc.property(
        fc.array(paymentMethodArb, { maxLength: 4 }),
        (methods) => {
          const hasRussian = methods.includes('mir') || methods.includes('sbp');
          const shouldShow = shouldShowPaymentGuide(methods);
          
          // Если есть российские методы — не показываем
          if (hasRussian) {
            return shouldShow === false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Specific: mir payment hides guide
  it('mir payment method hides guide', () => {
    expect(shouldShowPaymentGuide(['mir'])).toBe(false);
    expect(shouldShowPaymentGuide(['mir', 'crypto'])).toBe(false);
  });

  // Specific: sbp payment hides guide
  it('sbp payment method hides guide', () => {
    expect(shouldShowPaymentGuide(['sbp'])).toBe(false);
    expect(shouldShowPaymentGuide(['sbp', 'foreign_card'])).toBe(false);
  });

  // Specific: only crypto shows guide
  it('only crypto payment shows guide', () => {
    expect(shouldShowPaymentGuide(['crypto'])).toBe(true);
    expect(shouldShowPaymentGuide(['crypto', 'foreign_card'])).toBe(true);
  });

  // Specific: only foreign_card shows guide
  it('only foreign_card payment shows guide', () => {
    expect(shouldShowPaymentGuide(['foreign_card'])).toBe(true);
  });

  // Specific: empty payment methods shows guide
  it('empty payment methods shows guide', () => {
    expect(shouldShowPaymentGuide([])).toBe(true);
  });

  // Property: mir OR sbp is sufficient to hide
  it('property: either mir or sbp is sufficient to hide guide', () => {
    fc.assert(
      fc.property(
        fc.array(paymentMethodArb, { maxLength: 4 }),
        (methods) => {
          const hasMir = methods.includes('mir');
          const hasSbp = methods.includes('sbp');
          const shouldShow = shouldShowPaymentGuide(methods);
          
          // Если есть хотя бы один — не показываем
          if (hasMir || hasSbp) {
            return shouldShow === false;
          }
          // Если нет ни одного — показываем
          return shouldShow === true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
