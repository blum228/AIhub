# Requirements Document

## Introduction

Миграция проекта AIGirlsHub на единую дизайн-систему IDS (Intuition Design System). 

**Фаза 1 (завершена):** Устранение несогласованности в стилях — токены вместо хардкодов.

**Фаза 2 (текущая):** Унификация визуального языка между страницами. Homepage и каталог должны выглядеть как части одного продукта с единым вайбом. Референс: https://intuition-tech.github.io/ids/#intro

Ключевые принципы IDS:
- Минимализм и чистота
- Консистентные паттерны компонентов
- Единый ритм отступов
- Спокойная цветовая палитра с акцентами

## Glossary

- **IDS (Intuition Design System)**: Дизайн-система с токенами для цветов, отступов, типографики и других визуальных свойств
- **Токен**: CSS-переменная из дизайн-системы (например, `--ids__space-m`, `--ids__text-primary`)
- **Хардкод**: Жёстко заданное значение вместо токена (например, `0.5em` вместо `var(--ids__space-s)`)
- **Компонент**: Astro-файл в папке `src/components/`
- **Глобальные стили**: CSS-файлы в папке `src/styles/`

## Requirements

### Requirement 1

**User Story:** As a developer, I want all links to have consistent styling, so that the UI looks unified across all pages.

#### Acceptance Criteria

1. WHEN a link is rendered in body text THEN the system SHALL apply `color: var(--ids__link)` and `text-decoration: underline`
2. WHEN a user hovers over a body text link THEN the system SHALL change color to `var(--ids__link-hover)`
3. WHEN a link is rendered in navigation (header, footer, breadcrumbs) THEN the system SHALL apply `color: var(--ids__text-secondary)` and `text-decoration: none`
4. WHEN a user hovers over a navigation link THEN the system SHALL change color to `var(--ids__text-primary)`
5. WHEN a link is rendered as a CTA button THEN the system SHALL follow button styling rules without underline

### Requirement 2

**User Story:** As a developer, I want all spacing values to use IDS tokens, so that the layout is consistent and maintainable.

#### Acceptance Criteria

1. WHEN spacing is applied to any element THEN the system SHALL use IDS spacing tokens (`--ids__space-2xs` through `--ids__space-3xl`)
2. WHEN a component uses hardcoded spacing values (e.g., `0.5em`, `1em`, `0.8em`) THEN the system SHALL replace them with the nearest IDS token
3. WHEN gap or margin values are defined THEN the system SHALL use IDS spacing tokens exclusively

### Requirement 3

**User Story:** As a developer, I want all font sizes to use IDS tokens, so that typography is consistent across the site.

#### Acceptance Criteria

1. WHEN font-size is applied to any element THEN the system SHALL use IDS typography tokens (`--ids__font-size-hero` through `--ids__font-size-micro`)
2. WHEN a component uses hardcoded font sizes (e.g., `1.1em`, `0.95em`) THEN the system SHALL replace them with the nearest IDS token
3. WHEN font-weight is applied THEN the system SHALL use IDS weight tokens (`--ids__font-weight-regular` through `--ids__font-weight-heavy`)

### Requirement 4

**User Story:** As a developer, I want all border-radius values to use IDS tokens, so that corners are consistent across components.

#### Acceptance Criteria

1. WHEN border-radius is applied to any element THEN the system SHALL use IDS radius tokens (`--ids__radius-xs` through `--ids__radius-full`)
2. WHEN a component uses hardcoded radius values (e.g., `0.5em`, `1em`) THEN the system SHALL replace them with the nearest IDS token

### Requirement 5

**User Story:** As a developer, I want all colors to use IDS semantic tokens, so that theming and maintenance are simplified.

#### Acceptance Criteria

1. WHEN text color is applied THEN the system SHALL use IDS text tokens (`--ids__text-primary`, `--ids__text-secondary`, `--ids__text-tertiary`, `--ids__text-muted`)
2. WHEN background color is applied THEN the system SHALL use IDS background tokens (`--ids__bg-page`, `--ids__bg-surface`, `--ids__bg-elevated`)
3. WHEN border color is applied THEN the system SHALL use IDS border tokens (`--ids__border-subtle`, `--ids__border-default`, `--ids__border-strong`)
4. WHEN success/positive color is needed THEN the system SHALL use `var(--ids__success)` instead of hardcoded `rgb(0, 140, 70)`
5. WHEN accent color is needed THEN the system SHALL use `var(--ids__accent)` or related tokens

### Requirement 6

**User Story:** As a developer, I want a global stylesheet for base HTML elements, so that default styling is consistent without component-specific overrides.

#### Acceptance Criteria

1. WHEN the global styles are loaded THEN the system SHALL define default link styles for `<a>` elements
2. WHEN the global styles are loaded THEN the system SHALL define default heading styles for `<h1>` through `<h6>` elements
3. WHEN the global styles are loaded THEN the system SHALL define default paragraph styles for `<p>` elements
4. WHEN the global styles are loaded THEN the system SHALL define default list styles for `<ul>`, `<ol>`, `<li>` elements

### Requirement 7

**User Story:** As a developer, I want consistent CSS class naming, so that the codebase is easier to understand and maintain.

#### Acceptance Criteria

1. WHEN a new CSS class is created for IDS components THEN the system SHALL use the `ids__` prefix
2. WHEN existing `aigh__` prefixed classes are found THEN the system SHALL migrate them to `ids__` prefix where appropriate
3. WHEN component-specific classes are needed THEN the system SHALL use scoped styles within Astro components

### Requirement 8

**User Story:** As a developer, I want IDS tokens to be documented, so that I can easily find the right token for each use case.

#### Acceptance Criteria

1. WHEN a developer needs to choose a spacing token THEN the tokens.css file SHALL contain comments explaining each token's intended use
2. WHEN a developer needs to choose a color token THEN the tokens.css file SHALL contain comments explaining semantic meaning
3. WHEN a developer needs to choose a typography token THEN the tokens.css file SHALL contain comments with pixel equivalents

---

## Фаза 2: Унификация визуального языка

### Requirement 9

**User Story:** As a user, I want all pages to have consistent visual rhythm, so that the site feels cohesive and professional.

#### Acceptance Criteria

1. WHEN a page section is rendered THEN the system SHALL use consistent vertical spacing (`--ids__space-xl` between major sections)
2. WHEN a page header is rendered THEN the system SHALL follow the same pattern: large title + subtitle in muted color
3. WHEN content blocks are displayed THEN the system SHALL use consistent internal padding (`--ids__space-l` for cards, `--ids__space-m` for compact elements)

### Requirement 10

**User Story:** As a user, I want the catalog page to match the homepage visual style, so that navigation feels seamless.

#### Acceptance Criteria

1. WHEN the catalog page is rendered THEN the system SHALL use the same hero pattern as homepage (large title, subtitle)
2. WHEN filter pills are displayed THEN the system SHALL use the same visual treatment as homepage goal cards (border, hover states)
3. WHEN model cards are displayed THEN the system SHALL use consistent card styling with homepage elements

### Requirement 11

**User Story:** As a user, I want interactive elements to have consistent hover states, so that the interface feels responsive and unified.

#### Acceptance Criteria

1. WHEN a user hovers over a card THEN the system SHALL apply consistent transform (`translateY(-2px)`) and shadow (`--ids__shadow-l`)
2. WHEN a user hovers over a navigation element THEN the system SHALL apply consistent color transition using `--ids__transition-fast`
3. WHEN a user hovers over a button THEN the system SHALL apply consistent opacity or background change

### Requirement 12

**User Story:** As a user, I want page layouts to follow a consistent structure, so that I can easily navigate and find information.

#### Acceptance Criteria

1. WHEN a page is rendered THEN the system SHALL use Wrapper component for consistent max-width and centering
2. WHEN breadcrumbs are displayed THEN the system SHALL position them consistently at the top of content area
3. WHEN a page has filters THEN the system SHALL display them in a consistent location below the page header
