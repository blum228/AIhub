# Design Document: IDS Migration

## Overview

Миграция проекта AIGirlsHub на единую дизайн-систему IDS. Проект включает:
1. Создание глобальных стилей для базовых HTML элементов
2. Рефакторинг компонентов для использования IDS токенов
3. Унификацию стилей ссылок, отступов, типографики, радиусов и цветов
4. Миграцию CSS классов с `aigh__` на `ids__` префикс

## Architecture

```
src/styles/
├── reset.css          # Базовый сброс стилей
├── tokens.css         # IDS токены (уже существует)
├── colors.css         # Цветовые переменные (уже существует)
├── settings.css       # Настройки шрифтов (уже существует)
├── typography.css     # NEW: Глобальные стили типографики
├── links.css          # NEW: Глобальные стили ссылок
└── layout.css         # Утилиты лейаута (уже существует)

src/components/
├── Header.astro       # Навигационные ссылки
├── Footer.astro       # Навигационные ссылки
├── Breadcrumbs.astro  # Навигационные ссылки
├── CTAButton.astro    # Кнопки-ссылки
├── Card.astro         # Карточки
├── ModelCardSemantic.astro
├── ModelHero.astro
├── VerdictBox.astro
├── ProsConsList.astro
└── ...
```

## Components and Interfaces

### 1. Global Link Styles (`src/styles/links.css`)

Новый файл с глобальными стилями для ссылок:

```css
/* Body text links */
a {
  color: var(--ids__link);
  text-decoration: underline;
  text-underline-offset: 0.15em;
  transition: color var(--ids__transition-fast);
}

a:hover {
  color: var(--ids__link-hover);
}

/* Navigation links - applied via class */
.ids__nav-link {
  color: var(--ids__text-secondary);
  text-decoration: none;
}

.ids__nav-link:hover {
  color: var(--ids__text-primary);
  text-decoration: none;
}
```

### 2. Global Typography Styles (`src/styles/typography.css`)

Новый файл с глобальными стилями типографики:

```css
h1 {
  font-size: var(--ids__font-size-h1);
  font-weight: var(--ids__font-weight-bold);
  line-height: var(--ids__line-height-tight);
  margin: 0 0 var(--ids__space-s) 0;
}

h2 {
  font-size: var(--ids__font-size-h2);
  font-weight: var(--ids__font-weight-semibold);
  line-height: var(--ids__line-height-snug);
  margin: 0 0 var(--ids__space-xs) 0;
}

/* ... и так далее для h3-h6, p, ul, ol */
```

### 3. Token Mapping Table

Маппинг хардкодов на IDS токены:

| Hardcoded Value | IDS Token | Context |
|-----------------|-----------|---------|
| `0.4em` | `--ids__space-xs` | Small gaps |
| `0.5em` | `--ids__space-s` | Medium-small gaps |
| `0.8em` | `--ids__space-s` | Margins |
| `1em` | `--ids__space-m` | Standard spacing |
| `1.2em` | `--ids__space-l` | Large spacing |
| `1.5em` | `--ids__space-l` | Section gaps |
| `0.5em` (radius) | `--ids__radius-s` | Small corners |
| `1em` (radius) | `--ids__radius-m` | Medium corners |
| `0.9em` (font) | `--ids__font-size-small` | Small text |
| `0.95em` (font) | `--ids__font-size-small` | Small text |
| `1.05em` (font) | `--ids__font-size-body` | Body text |
| `1.1em` (font) | `--ids__font-size-h4` | Subheadings |
| `rgb(0, 140, 70)` | `--ids__success` | Positive/success |
| `rgba(var(--ids__text-RGB), 0.85)` | `--ids__text-primary` | Primary text |
| `rgba(var(--ids__text-RGB), 0.7)` | `--ids__text-secondary` | Secondary text |
| `rgba(var(--ids__text-RGB), 0.6)` | `--ids__text-tertiary` | Tertiary text |

### 4. Component Migration Plan

#### Header.astro
- ✅ Already uses IDS tokens mostly
- Change: Add `ids__nav-link` class to links

#### Footer.astro
- ✅ Already uses IDS tokens mostly
- Change: Add `ids__nav-link` class to links

#### Breadcrumbs.astro
- Change: Replace `aigh__` prefix with `ids__`
- Change: Use `ids__nav-link` for link styling

#### CTAButton.astro
- Change: Replace `aigh__` prefix with `ids__`
- ✅ Already uses IDS tokens for spacing/colors

#### VerdictBox.astro
- Change: Replace `aigh__` prefix with `ids__`
- Change: Replace hardcoded spacing (`0.5em`, `0.8em`) with tokens
- Change: Replace hardcoded font sizes (`1.1em`, `1.05em`, `0.9em`) with tokens
- Change: Replace hardcoded radius (`0.5em`) with token

#### ProsConsList.astro
- Change: Replace `aigh__` prefix with `ids__`
- Change: Replace hardcoded spacing with tokens
- Change: Replace hardcoded font sizes with tokens
- Change: Replace hardcoded radius (`0.5em`) with token
- Change: Replace `rgb(0, 140, 70)` with `var(--ids__success)`

#### ModelHero.astro
- Change: Replace `aigh__` prefix with `ids__`
- Change: Replace hardcoded spacing (`0.5em`, `1em`) with tokens
- Change: Replace hardcoded font sizes (`2.2em`, `1.8em`, `1.1em`) with tokens
- Change: Replace hardcoded radius (`1em`) with token

#### ModelCardSemantic.astro
- Change: Replace hardcoded shadow `rgba(0, 0, 0, 0.1)` with token
- Change: Replace `rgb(0, 140, 70)` with `var(--ids__success)`

## Data Models

Не применимо — проект не использует базу данных. Все данные в YAML файлах.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Spacing Token Compliance
*For any* CSS rule in the codebase that defines spacing (margin, padding, gap), the value SHALL use an IDS spacing token (`--ids__space-*`) rather than a hardcoded value.
**Validates: Requirements 2.1, 2.2, 2.3**

### Property 2: Typography Token Compliance
*For any* CSS rule in the codebase that defines font-size or font-weight, the value SHALL use an IDS typography token (`--ids__font-size-*` or `--ids__font-weight-*`) rather than a hardcoded value.
**Validates: Requirements 3.1, 3.2, 3.3**

### Property 3: Radius Token Compliance
*For any* CSS rule in the codebase that defines border-radius, the value SHALL use an IDS radius token (`--ids__radius-*`) rather than a hardcoded value.
**Validates: Requirements 4.1, 4.2**

### Property 4: Color Token Compliance
*For any* CSS rule in the codebase that defines color, background-color, or border-color, the value SHALL use an IDS color token rather than a hardcoded RGB/RGBA value.
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 5: Link Styling Compliance
*For any* link element in the codebase, the styling SHALL follow IDS link conventions: body links use `--ids__link` color with underline, navigation links use `--ids__text-secondary` without underline.
**Validates: Requirements 1.1, 1.3, 1.5**

### Property 6: Naming Convention Compliance
*For any* CSS class in the codebase that is part of the design system, the class name SHALL use the `ids__` prefix rather than `aigh__` or other prefixes.
**Validates: Requirements 7.1, 7.2**

## Error Handling

- Если токен не существует — использовать ближайший существующий токен
- Если значение не маппится на токен — добавить новый токен в `tokens.css` с комментарием

## Testing Strategy

### Property-Based Testing

Используем скрипт на Node.js для проверки CSS файлов на соответствие IDS токенам.

**Библиотека**: `fast-check` для property-based testing

**Подход**:
1. Парсим все CSS файлы в `src/styles/` и `src/components/`
2. Извлекаем все CSS правила
3. Для каждого правила проверяем соответствие токенам

### Unit Tests

- Проверка существования глобальных стилей для базовых элементов
- Проверка наличия комментариев в `tokens.css`

### Test Configuration

```javascript
// Минимум 100 итераций для property-based тестов
fc.configureGlobal({ numRuns: 100 });
```

### Test Annotations

Каждый property-based тест будет аннотирован:
```javascript
// **Feature: ids-migration, Property 1: Spacing Token Compliance**
// **Validates: Requirements 2.1, 2.2, 2.3**
```
