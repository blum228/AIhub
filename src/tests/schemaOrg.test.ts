/**
 * **Feature: sng-redesign, Property 9: Schema.org microdata presence**
 * **Validates: Requirements 8.1**
 * 
 * Property test для Schema.org микроразметки
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

interface SchemaOrgProps {
  name: string;
  description: string;
  rating: number;
  reviewCount?: number;
  priceFrom?: number;
  pricing: 'free' | 'freemium' | 'paid';
  logo?: string;
  url: string;
}

// Функция генерации Schema.org JSON-LD (логика из SchemaOrg.astro)
function generateSchemaOrg(props: SchemaOrgProps): object {
  const { 
    name, 
    description, 
    rating, 
    reviewCount = 10, 
    priceFrom, 
    pricing,
    logo,
    url 
  } = props;

  const price = pricing === 'free' ? '0' : priceFrom ? String(priceFrom) : '9.99';

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": logo || "/images/default-logo.png",
    "url": url,
    "brand": {
      "@type": "Brand",
      "name": name
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.toFixed(1),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviewCount
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };
}

// Валидация Schema.org структуры
function validateSchemaOrg(schema: any): {
  hasContext: boolean;
  hasType: boolean;
  hasName: boolean;
  hasAggregateRating: boolean;
  hasValidRating: boolean;
} {
  return {
    hasContext: schema["@context"] === "https://schema.org",
    hasType: schema["@type"] === "Product",
    hasName: typeof schema.name === 'string' && schema.name.length > 0,
    hasAggregateRating: schema.aggregateRating?.["@type"] === "AggregateRating",
    hasValidRating: 
      parseFloat(schema.aggregateRating?.ratingValue) >= 0 &&
      parseFloat(schema.aggregateRating?.ratingValue) <= 5,
  };
}

// Генераторы
const pricingArb = fc.constantFrom('free', 'freemium', 'paid') as fc.Arbitrary<'free' | 'freemium' | 'paid'>;

const schemaPropsArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  rating: fc.float({ min: 0, max: 5, noNaN: true }),
  reviewCount: fc.option(fc.integer({ min: 1, max: 10000 }), { nil: undefined }),
  priceFrom: fc.option(fc.float({ min: 0, max: 100, noNaN: true }), { nil: undefined }),
  pricing: pricingArb,
  logo: fc.option(fc.webUrl(), { nil: undefined }),
  url: fc.webUrl(),
});

describe('Schema.org Microdata (Property 9)', () => {
  // Requirement 8.1: JSON-LD с @type="Product"
  it('property: schema has @type="Product"', () => {
    fc.assert(
      fc.property(schemaPropsArb, (props) => {
        const schema = generateSchemaOrg(props);
        const validation = validateSchemaOrg(schema);
        return validation.hasType;
      }),
      { numRuns: 100 }
    );
  });

  // Requirement 8.1: JSON-LD с aggregateRating
  it('property: schema has aggregateRating', () => {
    fc.assert(
      fc.property(schemaPropsArb, (props) => {
        const schema = generateSchemaOrg(props);
        const validation = validateSchemaOrg(schema);
        return validation.hasAggregateRating;
      }),
      { numRuns: 100 }
    );
  });

  // Property: rating value is valid
  it('property: rating value is between 0 and 5', () => {
    fc.assert(
      fc.property(schemaPropsArb, (props) => {
        const schema = generateSchemaOrg(props);
        const validation = validateSchemaOrg(schema);
        return validation.hasValidRating;
      }),
      { numRuns: 100 }
    );
  });

  // Property: all required fields present
  it('property: all required Schema.org fields are present', () => {
    fc.assert(
      fc.property(schemaPropsArb, (props) => {
        const schema = generateSchemaOrg(props);
        const validation = validateSchemaOrg(schema);
        return (
          validation.hasContext &&
          validation.hasType &&
          validation.hasName &&
          validation.hasAggregateRating
        );
      }),
      { numRuns: 100 }
    );
  });

  // Property: free pricing results in price "0"
  it('property: free pricing has price "0"', () => {
    fc.assert(
      fc.property(
        schemaPropsArb.filter(p => p.pricing === 'free'),
        (props) => {
          const schema = generateSchemaOrg(props) as any;
          return schema.offers.price === '0';
        }
      ),
      { numRuns: 50 }
    );
  });

  // Property: paid pricing with priceFrom uses that value
  it('property: paid pricing uses priceFrom value', () => {
    fc.assert(
      fc.property(
        schemaPropsArb.filter(p => p.pricing !== 'free' && p.priceFrom !== undefined && p.priceFrom > 0),
        (props) => {
          const schema = generateSchemaOrg(props) as any;
          return schema.offers.price === String(props.priceFrom);
        }
      ),
      { numRuns: 50 }
    );
  });

  // Specific test: valid JSON-LD structure
  it('generates valid JSON-LD structure', () => {
    const props: SchemaOrgProps = {
      name: 'Test AI',
      description: 'Test description',
      rating: 4.5,
      pricing: 'freemium',
      priceFrom: 9.99,
      url: 'https://example.com/test',
    };

    const schema = generateSchemaOrg(props);
    
    expect(schema).toHaveProperty('@context', 'https://schema.org');
    expect(schema).toHaveProperty('@type', 'Product');
    expect(schema).toHaveProperty('name', 'Test AI');
    expect(schema).toHaveProperty('aggregateRating');
    expect((schema as any).aggregateRating).toHaveProperty('@type', 'AggregateRating');
    expect((schema as any).aggregateRating).toHaveProperty('ratingValue', '4.5');
  });
});
