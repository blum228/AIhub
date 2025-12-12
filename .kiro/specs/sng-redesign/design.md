# Design Document: SNG Redesign

## Overview

Редизайн AIGirlsHub для СНГ-рынка с фокусом на:
- Расширенную систему фильтров с боковой панелью
- Улучшенные карточки сервисов с бейджами и GIF-превью
- Safe Mode для размытия NSFW-контента
- Раздел Dead AI для закрытых сервисов
- Тёмную тему по умолчанию
- SEO-оптимизацию под Яндекс

Все компоненты строятся на IDS (Intuition Design System).

## Architecture

```
src/
├── components/
│   ├── FilterPanel.astro        # Боковая панель фильтров
│   ├── FilterGroup.astro        # Группа чекбоксов
│   ├── ServiceCard.astro        # Карточка сервиса (новая)
│   ├── ServiceBadge.astro       # Бейдж (Free, 18+, Память, Мир)
│   ├── SafeModeToggle.astro     # Переключатель Safe Mode
│   ├── DeadBanner.astro         # Баннер для закрытых сервисов
│   └── PaymentGuide.astro       # Секция "Как оплатить из РФ"
├── pages/
│   └── catalog.astro            # Обновлённая страница каталога
├── styles/
│   └── colors.css               # Обновлённая цветовая схема (тёмная)
└── content/
    └── models/*.yaml            # Расширенная схема данных
```

### Принцип работы фильтрации

```
[URL params] → [Astro page] → [Filter models] → [Render cards]
     ↑                              ↓
[FilterPanel] ←──── [State sync] ────┘
```

Фильтрация работает через URL-параметры для SEO и возможности поделиться ссылкой:
- `/catalog?payment=mir&platform=telegram&nsfw=true`
- Astro читает параметры и фильтрует коллекцию на сервере
- FilterPanel синхронизирует состояние чекбоксов с URL

## Components and Interfaces

### FilterPanel

```astro
---
interface Props {
  activeFilters: {
    meaning: string[];      // ['nsfw', 'roleplay', 'psychology']
    features: string[];     // ['memory', 'image-gen', 'voice', 'scenario', 'russian']
    platform: string[];     // ['web', 'ios', 'android', 'telegram']
    payment: string[];      // ['free', 'mir', 'crypto']
  };
  showDead: boolean;
  totalCount: number;
  filteredCount: number;
}
---
```

Структура:
- Sticky на десктопе (слева, width: 280px)
- Выдвижная панель на мобильных (снизу вверх)
- Группы фильтров с заголовками
- Счётчик результатов

### ServiceCard

```astro
---
interface Props {
  slug: string;
  name: string;
  rating: number;
  pricing: 'free' | 'freemium' | 'paid';
  priceFrom?: number;
  tagline?: string;
  description: string;
  badges: Badge[];
  gifPreview?: string;
  status: 'active' | 'dead' | 'censored';
  affiliateUrl: string;
}

type Badge = {
  type: 'free' | 'nsfw' | 'memory' | 'mir' | 'russian' | 'voice' | 'telegram';
  label: string;
  color: string;
};
---
```

Визуал:
- Grid-сетка карточек (3 колонки на десктопе, 2 на планшете, 1 на мобильном)
- При hover — показ GIF-превью (если есть)
- Бейджи в верхней части карточки
- Рейтинг звёздами + цена внизу
- Dead-сервисы с opacity: 0.6 и серым оверлеем

### ServiceBadge

```astro
---
interface Props {
  type: 'free' | 'nsfw' | 'memory' | 'mir' | 'russian' | 'voice' | 'telegram' | 'dead' | 'censored';
}

const badgeConfig = {
  free: { label: 'Free', color: 'var(--ids__success)' },
  nsfw: { label: '18+', color: 'var(--ids__error)', hideInSafeMode: true },
  memory: { label: 'Память', color: 'var(--ids__link)' },
  mir: { label: 'Мир', color: '#4CAF50', icon: 'card' },
  russian: { label: 'RU', color: 'var(--ids__text-secondary)' },
  voice: { label: 'Голос', color: 'var(--ids__warning)' },
  telegram: { label: 'TG', color: '#0088cc' },
  dead: { label: 'Закрыт', color: 'var(--ids__text-muted)' },
  censored: { label: 'Цензура', color: 'var(--ids__text-muted)' },
};
---
```

### SafeModeToggle

```astro
---
// Состояние хранится в localStorage: 'aigirlshub_safe_mode'
// При активации добавляет класс 'safe-mode' на body
---
```

CSS-эффекты Safe Mode:
```css
body.safe-mode .nsfw-content {
  filter: blur(10px);
  transition: filter var(--ids__transition-normal);
}

body.safe-mode .badge--nsfw {
  display: none;
}
```

## Data Models

### Расширенная схема модели (models/*.yaml)

```yaml
# Новые поля для СНГ-специфики
payment_methods:
  - mir           # Карта Мир
  - sbp           # СБП
  - crypto        # Криптовалюта
  - foreign_card  # Иностранная карта

vpn_required: false  # Работает без VPN в РФ

platforms:
  - web
  - ios
  - android
  - telegram

status: active  # active | dead | censored
dead_reason: "Ввели жёсткую цензуру в марте 2024"
dead_date: "2024-03-15"

gif_preview: "/images/previews/candy-ai.gif"

# Гайд по оплате (если нет карт РФ)
payment_guide: |
  1. Купите USDT на бирже (Bybit, OKX)
  2. Оплатите через криптошлюз сервиса
  3. Или используйте виртуальную карту (Pyypl, Wise)
```

### Zod-схема (config.ts)

```typescript
// Добавить в существующую схему
payment_methods: z.array(z.enum(['mir', 'sbp', 'crypto', 'foreign_card'])).default([]),
vpn_required: z.boolean().default(true),
platforms: z.array(z.enum(['web', 'ios', 'android', 'telegram'])).default(['web']),
status: z.enum(['active', 'dead', 'censored']).default('active'),
dead_reason: z.string().optional(),
dead_date: z.string().optional(),
gif_preview: z.string().optional(),
payment_guide: z.string().optional(),
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Filter returns only matching services
*For any* set of services and any filter selection, all returned services SHALL satisfy ALL selected filter conditions (logical AND).

**Validates: Requirements 1.2, 1.3, 1.4, 1.5**

### Property 2: Badge rendering matches service data
*For any* service with specific attributes (pricing="free", nsfw=true, memoryType="persistent", payment_methods contains "mir"), the rendered card SHALL contain the corresponding badge.

**Validates: Requirements 3.3, 3.4, 3.5, 3.6**

### Property 3: Safe Mode toggles content visibility
*For any* page state, when Safe Mode is toggled, all elements with class "nsfw-content" SHALL have blur applied (active) or removed (inactive), and badges with type "nsfw" SHALL be hidden (active) or visible (inactive).

**Validates: Requirements 4.2, 4.3, 4.4**

### Property 4: Safe Mode state persistence (round-trip)
*For any* Safe Mode state change, saving to localStorage and then reading back SHALL return the same boolean value.

**Validates: Requirements 4.5**

### Property 5: Dead services visual indication
*For any* service with status="dead" or status="censored", the rendered card SHALL have opacity 0.6 and contain a badge indicating the status.

**Validates: Requirements 5.1, 5.2**

### Property 6: Dead filter exclusion
*For any* set of services with "show dead" filter disabled, the result SHALL NOT contain any services with status="dead" or status="censored".

**Validates: Requirements 5.5**

### Property 7: Schema validation
*For any* model YAML file, it SHALL pass Zod schema validation including new fields (payment_methods, vpn_required, platforms, status).

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

### Property 8: Payment guide conditional rendering
*For any* service page, the "Как оплатить из РФ" section SHALL be visible if and only if payment_methods does NOT contain "mir" or "sbp".

**Validates: Requirements 7.1, 7.3**

### Property 9: Schema.org microdata presence
*For any* service detail page, the HTML SHALL contain valid JSON-LD with @type="Product" and aggregateRating.

**Validates: Requirements 8.1**

### Property 10: Card contains required information
*For any* service card, the rendered HTML SHALL contain: name, rating, description (or tagline), at least one badge, and price indicator.

**Validates: Requirements 3.1**

## Error Handling

### Filter Errors
- Empty filter results: показать EmptyState с предложением сбросить фильтры
- Invalid URL params: игнорировать невалидные, применять только валидные
- Missing model data: пропустить сервис, логировать warning

### Safe Mode Errors
- localStorage недоступен: fallback на session state
- CSS не применился: использовать !important как fallback

### Data Errors
- Невалидный YAML: показать ошибку в dev, пропустить в prod
- Отсутствующие обязательные поля: использовать defaults из Zod-схемы

## Testing Strategy

### Dual Testing Approach

Проект использует два типа тестов:
1. **Unit tests** — проверка конкретных примеров и edge cases
2. **Property-based tests** — проверка универсальных свойств на множестве входных данных

### Property-Based Testing

**Библиотека:** fast-check (JavaScript/TypeScript)

**Конфигурация:** минимум 100 итераций на свойство

**Формат аннотации:**
```typescript
// **Feature: sng-redesign, Property 1: Filter returns only matching services**
// **Validates: Requirements 1.2, 1.3, 1.4, 1.5**
```

### Test Cases

#### Unit Tests
- FilterPanel рендерит все группы фильтров
- ServiceCard показывает все обязательные элементы
- SafeModeToggle переключает состояние
- DeadBanner показывает причину закрытия
- Тёмная тема применяет правильные цвета

#### Property Tests
1. **Filter correctness** — генерируем случайные сервисы и фильтры, проверяем что результат соответствует условиям
2. **Badge rendering** — генерируем сервисы с разными атрибутами, проверяем наличие бейджей
3. **Safe Mode toggle** — генерируем последовательности toggle, проверяем консистентность состояния
4. **Schema validation** — генерируем случайные YAML-данные, проверяем валидацию
5. **Dead filter** — генерируем сервисы с разными статусами, проверяем фильтрацию

### IDS Compliance Tests
- Все spacing используют --ids__space-* токены
- Все font-size используют --ids__font-size-* токены
- Все border-radius используют --ids__radius-* токены
- Все цвета используют семантические переменные
