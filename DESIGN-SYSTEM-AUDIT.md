# Аудит консистентности дизайн-системы AIGirlsHub

## ✅ ИСПРАВЛЕНО

Создан файл `src/styles/tokens.css` с едиными токенами дизайн-системы:

### Обновлённые компоненты:
- ✅ `index.astro` — главная страница
- ✅ `catalog.astro` — каталог
- ✅ `top/index.astro` — топы
- ✅ `compare/index.astro` — сравнения
- ✅ `models/[slug].astro` — страница модели
- ✅ `Header.astro`
- ✅ `Footer.astro`
- ✅ `ModelCard.astro`
- ✅ `CTAButton.astro`
- ✅ `CatalogFilters.astro`
- ✅ `Breadcrumbs.astro`
- ✅ `SectionTitle.astro`
- ✅ `PriceBadge.astro`
- ✅ `FeatureBadge.astro`
- ✅ `TopListItem.astro`
- ✅ `ids.css` — базовая типографика
- ✅ `layout.css` — Space компонент
- ✅ Создан `Card.astro` — базовый компонент карточки

### Токены:
- **Типографика**: `--ids__font-size-*`, `--ids__font-weight-*`, `--ids__line-height-*`
- **Отступы**: `--ids__space-*` (2xs, xs, s, m, l, xl, 2xl, 3xl)
- **Радиусы**: `--ids__radius-*` (xs, s, m, l, xl, full)
- **Цвета текста**: `--ids__text-*` (primary, secondary, tertiary, muted)
- **Границы**: `--ids__border-*` (subtle, default, strong, accent)
- **Фоны**: `--ids__bg-*` (page, surface, surface-hover, elevated, accent-subtle)
- **Тени**: `--ids__shadow-*` (s, m, l, accent)
- **Логотипы**: `--ids__logo-*` (xs, s, m, l, xl)
- **Transitions**: `--ids__transition-*` (fast, normal, slow)
- **Z-index**: `--ids__z-*` (dropdown, sticky, modal, tooltip)

---

## Обнаруженные проблемы (исходные)

---

## 🔴 1. РАЗМЕРЫ ШРИФТОВ — ХАОС

### Проблема: Нет единой шкалы типографики

**В `ids.css` определена система:**
```css
h1: 4em (mobile: 2.8em)
h2: 1.6em
h3: 1.2em
h4: 1.05em
```

**Но в компонентах используются произвольные значения:**

| Компонент | Элемент | Значение | Должно быть |
|-----------|---------|----------|-------------|
| `index.astro` | `.hero__title` | `3em` | `4em` (h1) |
| `Hero.astro` | `.aigh__hero-title` | `3.2em` | `4em` (h1) |
| `ModelHero.astro` | `.aigh__model-hero-name` | `2.2em` | `h1.S = 2.4em` |
| `models/[slug].astro` | `.model-hero__name` | `2em` | `h1.S = 2.4em` |
| `SectionTitle.astro` | `.aigh__section-title-text` | `1.5em` | `h2 = 1.6em` |
| `TopListItem.astro` | `.aigh__top-item-name` | `1.2em` | `h3 = 1.2em` ✓ |
| `top/index.astro` | `.top-card__title` | `1.15em` | `h3 = 1.2em` |
| `VerdictBox.astro` | `.aigh__verdict-title` | `1.1em` | `h3 = 1.2em` |
| `QuickPick.astro` | `.aigh__quick-pick-title` | `1.1em` | `h3 = 1.2em` |

### Решение: Создать CSS-переменные для типографики

```css
:root {
  --ids__font-size-hero: 4em;      /* Hero заголовок */
  --ids__font-size-h1: 2.4em;      /* Страничный заголовок */
  --ids__font-size-h2: 1.6em;      /* Секция */
  --ids__font-size-h3: 1.2em;      /* Карточка/блок */
  --ids__font-size-body: 1em;      /* Текст */
  --ids__font-size-small: 0.9em;   /* Мелкий текст */
  --ids__font-size-caption: 0.85em; /* Подписи */
  --ids__font-size-micro: 0.75em;  /* Бейджи */
}
```

---

## 🔴 2. BORDER-RADIUS — НЕСОГЛАСОВАННОСТЬ

### Проблема: 8+ разных значений радиуса

**В системе определено:**
```css
--ids__radius: 1.5em;
```

**Но используются:**

| Значение | Где используется |
|----------|------------------|
| `var(--ids__radius)` | `TopListItem`, `QuickPick` ✓ |
| `1em` | `ModelHero.astro` (logo) |
| `0.75em` | `index.astro` (path), `top/index.astro`, `compare/index.astro` |
| `0.6em` | `ModelCard.astro` (logo) |
| `0.5em` | `QuickPick` (item), `CategoryCards`, `compare-card__logo`, `TopListItem` (logo) |
| `0.4em` | `models/[slug].astro` (CTA) |
| `0.35em` | `CTAButton.astro` |
| `0.3em` | `PriceBadge.astro` |
| `0.25em` | `FeatureBadge.astro`, `Footer.astro` (age) |
| `2em` | `CatalogFilters.astro` (pills), `Hero.astro` (badge) |

### Решение: Шкала радиусов

```css
:root {
  --ids__radius-xs: 0.25em;  /* Бейджи, мелкие элементы */
  --ids__radius-s: 0.4em;    /* Кнопки, инпуты */
  --ids__radius-m: 0.6em;    /* Карточки, логотипы */
  --ids__radius-l: 1em;      /* Большие карточки */
  --ids__radius-xl: 1.5em;   /* Контейнеры */
  --ids__radius-full: 2em;   /* Pills, бейджи-теги */
}
```

---

## 🔴 3. КАРТОЧКИ — 5 РАЗНЫХ СТИЛЕЙ

### Проблема: Нет единого компонента карточки

**Стиль 1: `ModelCard.astro`**
```css
padding: 1em;
background: rgb(var(--ids__background-RGB));
border-radius: 0.75em;
border: none;
```

**Стиль 2: `index.astro` (paths)**
```css
padding: 1.5em;
background: rgba(var(--ids__surface-RGB), 0.4);
border: 1px solid rgba(var(--ids__text-RGB), 0.06);
border-radius: 0.75em;
```

**Стиль 3: `top/index.astro` (top-card)**
```css
padding: 1.5em;
background: rgba(var(--ids__surface-RGB), 0.4);
border: 1px solid rgba(var(--ids__text-RGB), 0.06);
border-radius: 0.75em;
```

**Стиль 4: `TopListItem.astro`**
```css
padding: calc(var(--ids__density) * 1.2em);
background-color: rgb(var(--ids__background-RGB));
border: 1px solid rgba(var(--ids__text-RGB), 0.08);
border-radius: var(--ids__radius);
```

**Стиль 5: `compare/index.astro` (compare-card)**
```css
padding: 1.5em;
background: rgba(var(--ids__surface-RGB), 0.4);
border: 1px solid rgba(var(--ids__text-RGB), 0.06);
border-radius: 0.75em;
```

### Решение: Единый Card компонент с вариантами

```css
.ids__card {
  padding: calc(var(--ids__density) * 1em);
  background: rgb(var(--ids__background-RGB));
  border: 1px solid rgba(var(--ids__text-RGB), 0.06);
  border-radius: var(--ids__radius-m);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ids__card:hover {
  border-color: rgba(var(--ids__text-RGB), 0.12);
  box-shadow: 0 4px 16px rgba(var(--ids__text-RGB), 0.06);
}

.ids__card--surface {
  background: rgba(var(--ids__surface-RGB), 0.4);
}

.ids__card--compact {
  padding: calc(var(--ids__density) * 0.75em);
}

.ids__card--large {
  padding: calc(var(--ids__density) * 1.5em);
}
```

---

## 🔴 4. ЦВЕТА ТЕКСТА — РАЗНЫЕ OPACITY

### Проблема: Хаотичные значения прозрачности

| Значение | Использование |
|----------|---------------|
| `rgba(var(--ids__text-RGB), 0.8)` | Breadcrumbs current, pros-cons |
| `rgba(var(--ids__text-RGB), 0.7)` | Hero subtitle, model desc, rating number |
| `rgba(var(--ids__text-RGB), 0.65)` | TopListItem desc, compare verdict |
| `rgba(var(--ids__text-RGB), 0.6)` | Hero badge, path desc, tops-desc, compare-desc |
| `rgba(var(--ids__text-RGB), 0.5)` | Hero badge (index), rating, footer links, filters count |
| `rgba(var(--ids__text-RGB), 0.4)` | Footer copy |
| `rgba(var(--ids__text-RGB), 0.3)` | Breadcrumbs sep, vs-text |

### Решение: Семантические переменные

```css
:root {
  --ids__text-primary: rgba(var(--ids__text-RGB), 1);
  --ids__text-secondary: rgba(var(--ids__text-RGB), 0.7);
  --ids__text-tertiary: rgba(var(--ids__text-RGB), 0.5);
  --ids__text-muted: rgba(var(--ids__text-RGB), 0.35);
}
```

---

## 🔴 5. ОТСТУПЫ — НЕТ СИСТЕМЫ

### Проблема: Смешение подходов

**Подход 1: CSS-переменные (правильно)**
```css
gap: calc(var(--ids__density) * 1em);
padding: calc(var(--ids__density) * 1.2em);
```

**Подход 2: Жёсткие значения (неправильно)**
```css
gap: 1em;
padding: 1.5em;
gap: 0.75em;
margin-bottom: 0.3em;
```

### Где нарушается:
- `index.astro`: `gap: 1em`, `gap: 3em`, `padding: 1.5em`
- `top/index.astro`: `gap: 1em`, `padding: 1.5em`
- `compare/index.astro`: `gap: 1em`, `gap: 1.5em`, `padding: 1.5em`
- `ModelCard.astro`: `gap: 1em`, `padding: 1em`
- `Header.astro`: `gap: 2em`, `padding: 0.8em`

### Решение: Использовать Space-шкалу везде

```css
:root {
  --ids__space-xs: calc(var(--ids__density) * 0.25em);
  --ids__space-s: calc(var(--ids__density) * 0.5em);
  --ids__space-m: calc(var(--ids__density) * 1em);
  --ids__space-l: calc(var(--ids__density) * 1.5em);
  --ids__space-xl: calc(var(--ids__density) * 2em);
  --ids__space-xxl: calc(var(--ids__density) * 3em);
}
```

---

## 🔴 6. HOVER-ЭФФЕКТЫ — РАЗНЫЕ СТИЛИ

### Проблема: Нет единого паттерна

**Вариант 1: Transform + Shadow**
```css
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(var(--ids__text-RGB), 0.06);
```

**Вариант 2: Только border-color**
```css
border-color: rgba(var(--ids__text-RGB), 0.12);
```

**Вариант 3: Background change**
```css
background: rgba(var(--ids__surface-RGB), 0.5);
```

**Вариант 4: Opacity**
```css
opacity: 0.9;
```

### Решение: Стандартизировать hover-эффекты

```css
/* Карточки */
.ids__card:hover {
  border-color: rgba(var(--ids__text-RGB), 0.12);
  box-shadow: 0 4px 16px rgba(var(--ids__text-RGB), 0.06);
}

/* Интерактивные карточки */
.ids__card--interactive:hover {
  transform: translateY(-2px);
}

/* Кнопки */
.ids__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--ids__accent-RGB), 0.3);
}
```

---

## 🟡 7. BREAKPOINTS — НЕСОГЛАСОВАННОСТЬ

### Проблема: Разные точки перелома

| Значение | Использование |
|----------|---------------|
| `768px` | Header, Wrapper, settings.css |
| `767px` | layout.css, ids.css, Hero.astro |
| `700px` | QuickPick.astro |
| `600px` | index.astro, Header (burger), ModelCard, ModelHero, TopListItem |
| `550px` | SectionTitle.astro |
| `500px` | index.astro (proof) |

### Решение: Единые breakpoints

```css
:root {
  --ids__breakpoint-mobile: 600px;
  --ids__breakpoint-tablet: 768px;
  --ids__breakpoint-desktop: 1024px;
}
```

---

## 🟡 8. ЛОГОТИПЫ — РАЗНЫЕ РАЗМЕРЫ

| Компонент | Размер | Радиус |
|-----------|--------|--------|
| `ModelCard.astro` | 3em × 3em | 0.6em |
| `TopListItem.astro` | 3.5em × 3.5em | 0.5em |
| `ModelHero.astro` | 6em × 6em | 1em |
| `models/[slug].astro` | 4em × 4em | 0.75em |
| `compare/index.astro` | 3em × 3em | 0.5em |

### Решение: Шкала размеров логотипов

```css
:root {
  --ids__logo-s: 3em;    /* Карточки в списке */
  --ids__logo-m: 4em;    /* Страница модели */
  --ids__logo-l: 6em;    /* Hero */
}
```

---

## 🟡 9. ДУБЛИРОВАНИЕ INLINE-СТИЛЕЙ

### Проблема: Одинаковые стили в разных местах

**Пример 1: Subtitle на страницах**
- `catalog.astro`: `.catalog__subtitle`
- `top/index.astro`: `.tops-desc`
- `compare/index.astro`: `.compare-desc`

Все три имеют почти идентичные стили:
```css
font-size: 1.1em;
color: rgba(var(--ids__text-RGB), 0.5-0.6);
```

**Пример 2: CTA-блоки**
- `compare/index.astro`: `.compare-cta`
- `models/[slug].astro`: `.final-cta`

### Решение: Вынести в общие компоненты

---

## 🟡 10. ЭМОДЗИ КАК ИКОНКИ

### Проблема: Непрофессионально выглядит

Используются в:
- `index.astro`: 🆓 🔍 ⭐
- `top/index.astro`: 🆓 🔞 🎤
- `QuickPick.astro`: 🆓 📸 🇷🇺
- `CategoryCards.astro`: эмодзи
- `FeatureBadge.astro`: 🎤 🔞 🇷🇺 🖼 🎭 ⚡ ✨
- `VerdictBox.astro`: ⚖️

### Решение: SVG-иконки или icon font

---

## Приоритет исправлений

| # | Задача | Влияние | Сложность |
|---|--------|---------|-----------|
| 1 | Создать CSS-переменные для типографики | Высокое | Низкая |
| 2 | Создать шкалу радиусов | Высокое | Низкая |
| 3 | Унифицировать карточки | Высокое | Средняя |
| 4 | Семантические цвета текста | Среднее | Низкая |
| 5 | Шкала отступов | Среднее | Средняя |
| 6 | Унифицировать hover-эффекты | Среднее | Низкая |
| 7 | Единые breakpoints | Низкое | Средняя |
| 8 | Шкала логотипов | Низкое | Низкая |
| 9 | Вынести дублирующиеся стили | Низкое | Средняя |
| 10 | Заменить эмодзи на иконки | Низкое | Высокая |

---

## Рекомендуемый порядок действий

1. **Создать `tokens.css`** с CSS-переменными для всех токенов
2. **Обновить `ids.css`** — использовать токены
3. **Рефакторинг компонентов** — заменить хардкод на переменные
4. **Создать базовый Card компонент**
5. **Унифицировать страницы**
