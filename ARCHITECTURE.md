# AIGIRLSHUB — Архитектура проекта

> Каталог AI-девушек (виртуальных компаньонов) с обзорами, рейтингами и сравнениями.

---

## 1. ОБЩИЕ ПАРАМЕТРЫ

| Параметр | Значение |
|----------|----------|
| Название | AIGirlsHub |
| Язык | Русский |
| Моделей на старте | 10 |
| Фильтрация | Статическая (страницы тегов) |
| Дизайн-система | IDS (Intuition Design System) |
| Фреймворк | Astro |

---

## 2. ЦЕЛЕВАЯ АУДИТОРИЯ

| Пользователь | Запрос |
|--------------|--------|
| Новичок | "Что такое AI-девушка? С чего начать?" |
| Выбирающий | "Какой сервис лучше? Бесплатный/платный?" |
| Сравнивающий | "Candy.AI или DreamGirl — что выбрать?" |
| Специфический | "AI с голосом", "NSFW", "на русском" |

---

## 3. КАРТА САЙТА

```
                         ┌─────────────┐
                         │   ГЛАВНАЯ   │
                         │      /      │
                         └──────┬──────┘
                                │
        ┌───────────────┬───────┼───────┬───────────────┐
        │               │       │       │               │
        ▼               ▼       ▼       ▼               ▼
┌───────────┐   ┌───────────┐ ┌───┐ ┌───────────┐ ┌───────────┐
│  КАТАЛОГ  │   │   ТОПЫ    │ │ТЕГ│ │ СРАВНЕНИЯ │ │  СЛУЖЕБ.  │
│ /catalog  │   │  /top/*   │ │/*/ │ │/compare/* │ │ /about и тд│
└─────┬─────┘   └───────────┘ └───┘ └───────────┘ └───────────┘
      │
      ▼
┌───────────┐
│  МОДЕЛЬ   │
│/models/*  │
└───────────┘
```

---

## 4. ТИПЫ СТРАНИЦ

### 4.1 Главная (`/`)

**Цель:** Точка входа, навигация, SEO-якорь

**Блоки:**
- Hero (заголовок, подзаголовок, CTA)
- Топ-3 рекомендуемых модели
- Категории (ссылки на теги)
- Последние обзоры (4-6 карточек)
- FAQ (Schema.org FAQPage)

---

### 4.2 Каталог (`/catalog`)

**Цель:** Все AI-девушки в одном месте

**Блоки:**
- Заголовок
- Ссылки на теги (фильтры)
- Сетка карточек моделей
- Сортировка: по рейтингу (статическая)

---

### 4.3 Страница тега (`/tag/nsfw`, `/tag/free`, ...)

**Цель:** Статическая фильтрация по категории

**Блоки:**
- Заголовок категории
- Описание
- Карточки моделей с этим тегом

---

### 4.4 Карточка модели (`/models/candy-ai`)

**Цель:** Полный обзор одной AI-девушки

**Блоки:**
- Breadcrumbs
- Hero модели (лого, название, рейтинг, CTA)
- Плюсы / Минусы
- Таблица характеристик
- Полный обзор (Markdown)
- Похожие модели

---

### 4.5 Топ/Подборка (`/top/best-free`)

**Цель:** SEO-статья со списком лучших

**Примеры:**
- `/top/best-free` — Лучшие бесплатные
- `/top/best-nsfw` — Лучшие NSFW
- `/top/best-voice` — С голосовым общением

**Блоки:**
- Заголовок + вступление
- Нумерованный список с мини-обзорами
- Сравнительная таблица
- Заключение

---

### 4.6 Сравнение (`/compare/candy-vs-dreamgirl`)

**Цель:** A vs B для выбора

**Блоки:**
- Заголовок
- Две модели рядом
- Таблица сравнения
- Вердикт

---

### 4.7 Служебные

- `/about` — О проекте
- `/contacts` — Контакты
- `/privacy` — Политика конфиденциальности
- `/disclaimer` — Affiliate disclosure

---

## 5. СУЩНОСТИ (ДАННЫЕ)

### 5.1 Модель (AI-девушка)

```yaml
slug: candy-ai
name: Candy.AI
logo: /images/models/candy-ai.webp
rating: 4.8                        # 1-5
pricing: freemium                  # free | freemium | paid
price_from: 9.99                   # USD, опционально
description: "Краткое описание"
pros:
  - Реалистичные диалоги
  - Генерация изображений
cons:
  - Ограниченный бесплатный план
features:
  voice: true
  nsfw: true
  image_gen: true
  russian: false
  api: false
tags:
  - nsfw
  - voice
  - roleplay
affiliate_url: https://candy.ai/?ref=xxx
seo:
  title: "Candy.AI — обзор, цены, альтернативы 2025"
  description: "Полный обзор Candy.AI..."
```

### 5.2 Топ

```yaml
slug: best-free
title: "Лучшие бесплатные AI-девушки 2025"
description: "Топ сервисов без оплаты..."
models:
  - character-ai
  - replika
  - ...
```

+ Markdown-контент

### 5.3 Сравнение

```yaml
slug: candy-vs-dreamgirl
title: "Candy.AI vs DreamGirl: что выбрать?"
model_a: candy-ai
model_b: dreamgirl
verdict: "Candy.AI лучше для..."
```

+ Markdown-контент

---

## 6. ТЕГИ (категории)

Статические страницы для фильтрации:

| Тег | URL | Описание |
|-----|-----|----------|
| free | `/tag/free` | Бесплатные |
| nsfw | `/tag/nsfw` | 18+ контент |
| voice | `/tag/voice` | С голосовым общением |
| russian | `/tag/russian` | На русском языке |
| roleplay | `/tag/roleplay` | Ролевые игры |
| image-gen | `/tag/image-gen` | Генерация изображений |

---

## 7. СТРУКТУРА ФАЙЛОВ

```
/src
  /content/                    # ДАННЫЕ
    config.ts                  # Zod-схемы
    /models/                   # YAML моделей
      candy-ai.yaml
      character-ai.yaml
      ...
    /tops/                     # Markdown топов
      best-free.md
      best-nsfw.md
      ...
    /comparisons/              # Markdown сравнений
      candy-vs-dreamgirl.md

  /layouts/                    # ШАБЛОНЫ
    BaseLayout.astro           # ✓ есть
    ModelLayout.astro          # создать
    ArticleLayout.astro        # создать

  /components/                 # КОМПОНЕНТЫ
    # ═══ СУЩЕСТВУЮЩИЕ (IDS) ═══
    Wrapper.astro              # ✓
    TextWidth.astro            # ✓
    Space.astro                # ✓
    Section.astro              # ✓
    Sequence.astro             # ✓
    SequenceItem.astro         # ✓
    Aside.astro                # ✓
    Rounded.astro              # ✓
    Navbar.astro               # ✓
    NavItem.astro              # ✓
    Gallery.astro              # ✓
    GalleryItem.astro          # ✓
    InlineGallery.astro        # ✓
    Sleepy.astro               # ✓
    Footnote.astro             # ✓
    FootnoteLink.astro         # ✓
    PromoLink.astro            # ✓
    ColorPlate.astro           # ✓

    # ═══ НОВЫЕ (создать) ═══
    Header.astro               # Шапка сайта
    Footer.astro               # Подвал
    Logo.astro                 # Логотип AIGirlsHub
    Breadcrumbs.astro          # Хлебные крошки
    ModelCard.astro            # Карточка в каталоге
    ModelHero.astro            # Шапка страницы модели
    RatingStars.astro          # Звёздный рейтинг
    ProsConsList.astro         # Плюсы/минусы
    FeatureTable.astro         # Таблица характеристик
    FeatureBadge.astro         # Бейдж фичи (Голос, NSFW...)
    PriceBadge.astro           # Бейдж цены (Free, $9.99)
    CTAButton.astro            # Кнопка с affiliate
    TagList.astro              # Список тегов
    TagLink.astro              # Ссылка на тег
    TopListItem.astro          # Элемент топа (№1, №2...)
    CompareTable.astro         # Таблица сравнения A vs B
    FAQItem.astro              # Вопрос-ответ
    FAQList.astro              # Список FAQ

  /pages/                      # СТРАНИЦЫ
    index.astro                # Главная
    catalog.astro              # Каталог
    about.astro                # О проекте
    contacts.astro             # Контакты
    privacy.astro              # Политика
    disclaimer.astro           # Дисклеймер
    /models/
      [slug].astro             # Динамические страницы моделей
    /top/
      [slug].astro             # Динамические топы
    /compare/
      [slug].astro             # Динамические сравнения
    /tag/
      [tag].astro              # Страницы тегов

  /styles/                     # СТИЛИ
    # ═══ СУЩЕСТВУЮЩИЕ (IDS) ═══
    colors.css                 # ✓
    reset.css                  # ✓
    settings.css               # ✓
    layout.css                 # ✓
    ids.css                    # ✓
    gallery.css                # ✓
    navbar.css                 # ✓
    promo-block.css            # ✓
    footnotes.css              # ✓

    # ═══ НОВЫЕ (создать) ═══
    header.css                 # Шапка
    footer.css                 # Подвал
    model-card.css             # Карточка
    rating.css                 # Рейтинг
    badges.css                 # Бейджи
    cta.css                    # CTA-кнопки
    breadcrumbs.css            # Хлебные крошки
    faq.css                    # FAQ
    compare.css                # Сравнения

/public
  /images/
    /models/                   # Логотипы сервисов (webp)
    /og/                       # OG-картинки
    favicon.svg
```

---

## 8. КОМПОНЕНТЫ — ДЕТАЛЬНОЕ ОПИСАНИЕ

### 8.1 Header.astro

```
┌────────────────────────────────────────────────┐
│ [Logo]  Каталог  Топы  О проекте        [CTA]  │
└────────────────────────────────────────────────┘
```

**Props:** нет
**Использует:** Logo, CTAButton, Wrapper

---

### 8.2 Footer.astro

```
┌────────────────────────────────────────────────┐
│ AIGirlsHub © 2025                              │
│ Каталог | Топы | О проекте | Контакты          │
│ Политика | Дисклеймер                          │
└────────────────────────────────────────────────┘
```

**Props:** нет
**Использует:** Wrapper, TextWidth

---

### 8.3 ModelCard.astro

```
┌─────────────────────────┐
│ [Logo]                  │
│ Название         ★★★★☆ │
│ Краткое описание...     │
│ [Free] [NSFW] [Voice]   │
│ [Подробнее →]           │
└─────────────────────────┘
```

**Props:**
- model: Model (из Content Collection)

**Использует:** RatingStars, FeatureBadge, PriceBadge, Rounded

---

### 8.4 ModelHero.astro

```
┌────────────────────────────────────────────────┐
│ [Logo]   CANDY.AI                    ★★★★☆    │
│          Лучший AI-компаньон для...            │
│          [Free] [NSFW] [Voice]                 │
│          [Перейти на сайт →]                   │
└────────────────────────────────────────────────┘
```

**Props:**
- model: Model

**Использует:** RatingStars, FeatureBadge, PriceBadge, CTAButton, Rounded

---

### 8.5 RatingStars.astro

```
★★★★☆ 4.5
```

**Props:**
- rating: number (1-5)
- showNumber?: boolean

---

### 8.6 ProsConsList.astro

```
┌──────────────────┬──────────────────┐
│ ✓ Плюсы          │ ✗ Минусы         │
│ • Пункт 1        │ • Пункт 1        │
│ • Пункт 2        │ • Пункт 2        │
└──────────────────┴──────────────────┘
```

**Props:**
- pros: string[]
- cons: string[]

**Использует:** Sequence, SequenceItem

---

### 8.7 FeatureTable.astro

```
┌────────────────────────────────────┐
│ Характеристика     │ Значение      │
├────────────────────┼───────────────┤
│ Голосовое общение  │ ✓ Да          │
│ NSFW               │ ✓ Да          │
│ Русский язык       │ ✗ Нет         │
│ Цена от            │ $9.99/мес     │
└────────────────────────────────────┘
```

**Props:**
- features: Features
- price_from?: number

---

### 8.8 FeatureBadge.astro

```
[🎤 Голос]  [🔞 NSFW]  [🇷🇺 Русский]
```

**Props:**
- type: 'voice' | 'nsfw' | 'russian' | 'image-gen' | 'roleplay' | 'api'

---

### 8.9 PriceBadge.astro

```
[Бесплатно]  [От $9.99]  [Платный]
```

**Props:**
- pricing: 'free' | 'freemium' | 'paid'
- price_from?: number

---

### 8.10 CTAButton.astro

```
[Перейти на сайт →]
```

**Props:**
- href: string
- text?: string
- external?: boolean (default: true)

**Стиль:** На основе IDS accent color

---

### 8.11 Breadcrumbs.astro

```
Главная → Каталог → Candy.AI
```

**Props:**
- items: { label: string, href?: string }[]

**SEO:** Генерирует Schema.org BreadcrumbList

---

### 8.12 TagList.astro

```
[Бесплатные] [NSFW] [С голосом] [Ролевые]
```

**Props:**
- tags: string[]

**Использует:** TagLink

---

### 8.13 TagLink.astro

```
[NSFW]
```

**Props:**
- tag: string
- active?: boolean

---

### 8.14 TopListItem.astro

```
┌────────────────────────────────────────────────┐
│ #1  [Logo]  CANDY.AI                  ★★★★☆   │
│             Описание...                        │
│             [Подробнее] [Перейти →]            │
└────────────────────────────────────────────────┘
```

**Props:**
- position: number
- model: Model

---

### 8.15 CompareTable.astro

```
┌────────────────┬───────────┬───────────┐
│                │ Candy.AI  │ DreamGirl │
├────────────────┼───────────┼───────────┤
│ Рейтинг        │ ★★★★☆    │ ★★★★★    │
│ Цена           │ $9.99     │ $14.99    │
│ Голос          │ ✓         │ ✓         │
│ NSFW           │ ✓         │ ✗         │
└────────────────┴───────────┴───────────┘
```

**Props:**
- model_a: Model
- model_b: Model

---

### 8.16 FAQItem.astro

```
▶ Вопрос?
  Ответ...
```

**Props:**
- question: string
- answer: string (HTML)

**SEO:** Schema.org Question

---

### 8.17 FAQList.astro

```
Обёртка для FAQItem с Schema.org FAQPage
```

**Props:**
- items: { question: string, answer: string }[]

---

## 9. WIREFRAMES СТРАНИЦ

### 9.1 Главная

```
┌────────────────────────────────────────────────┐
│                   HEADER                       │
├────────────────────────────────────────────────┤
│                                                │
│         AIGirlsHub                             │
│         Найди идеальную AI-девушку             │
│         [Смотреть каталог]                     │
│                                                │
├────────────────────────────────────────────────┤
│  ТОП-3 РЕКОМЕНДУЕМЫХ                           │
│  [ModelCard] [ModelCard] [ModelCard]           │
├────────────────────────────────────────────────┤
│  КАТЕГОРИИ                                     │
│  [Бесплатные] [NSFW] [С голосом] [На русском]  │
├────────────────────────────────────────────────┤
│  ВСЕ МОДЕЛИ                                    │
│  [ModelCard] [ModelCard] [ModelCard]           │
│  [ModelCard] [ModelCard] [ModelCard]           │
│  [Смотреть все →]                              │
├────────────────────────────────────────────────┤
│  FAQ                                           │
│  ▶ Что такое AI-девушка?                       │
│  ▶ Это безопасно?                              │
│  ▶ Сколько стоит?                              │
├────────────────────────────────────────────────┤
│                   FOOTER                       │
└────────────────────────────────────────────────┘
```

### 9.2 Каталог

```
┌────────────────────────────────────────────────┐
│                   HEADER                       │
├────────────────────────────────────────────────┤
│  Breadcrumbs: Главная → Каталог                │
├────────────────────────────────────────────────┤
│  КАТАЛОГ AI-ДЕВУШЕК                            │
│  Описание раздела...                           │
├────────────────────────────────────────────────┤
│  ФИЛЬТРЫ (теги)                                │
│  [Все] [Бесплатные] [NSFW] [С голосом]         │
├────────────────────────────────────────────────┤
│  [ModelCard] [ModelCard] [ModelCard]           │
│  [ModelCard] [ModelCard] [ModelCard]           │
│  [ModelCard] [ModelCard] [ModelCard]           │
│  [ModelCard]                                   │
├────────────────────────────────────────────────┤
│                   FOOTER                       │
└────────────────────────────────────────────────┘
```

### 9.3 Страница модели

```
┌────────────────────────────────────────────────┐
│                   HEADER                       │
├────────────────────────────────────────────────┤
│  Breadcrumbs: Главная → Каталог → Candy.AI     │
├────────────────────────────────────────────────┤
│                                                │
│  [ModelHero]                                   │
│                                                │
├────────────────────────────────────────────────┤
│  [ProsConsList]                                │
├────────────────────────────────────────────────┤
│  [FeatureTable]                                │
├────────────────────────────────────────────────┤
│  ПОДРОБНЫЙ ОБЗОР                               │
│  (Markdown content)                            │
├────────────────────────────────────────────────┤
│  ПОХОЖИЕ МОДЕЛИ                                │
│  [ModelCard] [ModelCard] [ModelCard]           │
├────────────────────────────────────────────────┤
│                   FOOTER                       │
└────────────────────────────────────────────────┘
```

### 9.4 Топ

```
┌────────────────────────────────────────────────┐
│                   HEADER                       │
├────────────────────────────────────────────────┤
│  Breadcrumbs: Главная → Топы → Лучшие бесплатные│
├────────────────────────────────────────────────┤
│  ЛУЧШИЕ БЕСПЛАТНЫЕ AI-ДЕВУШКИ 2025             │
│  Вступительный текст...                        │
├────────────────────────────────────────────────┤
│  [TopListItem #1]                              │
│  [TopListItem #2]                              │
│  [TopListItem #3]                              │
│  ...                                           │
├────────────────────────────────────────────────┤
│  СРАВНИТЕЛЬНАЯ ТАБЛИЦА                         │
│  [CompareTable]                                │
├────────────────────────────────────────────────┤
│  ЗАКЛЮЧЕНИЕ                                    │
│  (Markdown)                                    │
├────────────────────────────────────────────────┤
│                   FOOTER                       │
└────────────────────────────────────────────────┘
```

---

## 10. ПОРЯДОК РАЗРАБОТКИ

| # | Этап | Файлы | Статус |
|---|------|-------|--------|
| 1 | Базовые компоненты | Header, Footer, Logo, Breadcrumbs | ✅ |
| 2 | Обновить BaseLayout | SiteLayout с Header/Footer | ✅ |
| 3 | Content Collections | config.ts, схемы | ✅ |
| 4 | Тестовые данные | 10 моделей в YAML | ✅ |
| 5 | Карточка модели | ModelCard, RatingStars, Badges | ✅ |
| 6 | Главная страница | index.astro | ✅ |
| 7 | Каталог | catalog.astro | ✅ |
| 8 | Страница модели | [slug].astro, ModelHero, ProsConsList | ✅ |
| 9 | Страницы тегов | /tag/[tag].astro | ✅ |
| 10 | Топы | /top/[slug].astro, TopListItem | ✅ |
| 11 | Сравнения | /compare/[slug].astro, CompareTable | ✅ |
| 12 | Служебные страницы | about, privacy, disclaimer | ✅ |
| 13 | SEO | meta, Schema.org, sitemap | ✅ |
| 14 | Полные данные | 10 моделей, 3 топа | ✅ |
| 15 | Деплой | Vercel/Cloudflare | ⬜ |

---

## 11. SEO-ТРЕБОВАНИЯ

### Meta-теги (в BaseLayout)
- `<title>` — уникальный для каждой страницы
- `<meta name="description">` — уникальный
- `<link rel="canonical">` — канонический URL
- Open Graph: og:title, og:description, og:image
- Twitter Card

### Schema.org
- **Главная:** WebSite, Organization
- **Модель:** Product, AggregateRating, Review
- **Топ:** Article, ItemList
- **FAQ:** FAQPage

### Sitemap
- Автогенерация через `@astrojs/sitemap`

### Robots.txt
- Разрешить всё, кроме служебных

---

## 12. ПРИНЦИПЫ ДИЗАЙНА

### Наследование от IDS
1. **Цвета** — использовать CSS-переменные из `colors.css`
2. **Отступы** — компонент `Space` с размерами S/M/L/XL
3. **Ширина контента** — `Wrapper` и `TextWidth`
4. **Типографика** — стили из `ids.css`
5. **Скругления** — компонент `Rounded`

### Новые стили
- Писать в отдельных CSS-файлах
- Использовать CSS-переменные IDS
- Префикс классов: `aigh__` (aigirlshub)
- Минимум кастомных значений

---

*Документ создан: 2025-12-11*
*Версия: 1.1*
*Последнее обновление: 2025-12-11*

---

## 13. СОЗДАННЫЕ ФАЙЛЫ (Фаза 1)

### Компоненты (`/src/components/`)
```
✅ Header.astro        — Шапка сайта с навигацией
✅ Footer.astro        — Подвал сайта
✅ Logo.astro          — Логотип AIGirlsHub
✅ Breadcrumbs.astro   — Хлебные крошки + Schema.org
✅ Hero.astro          — Hero-секция главной
✅ SectionTitle.astro  — Заголовок секции с ссылкой
✅ ModelCard.astro     — Карточка модели в каталоге
✅ ModelGrid.astro     — Сетка карточек
✅ ModelHero.astro     — Hero страницы модели
✅ RatingStars.astro   — Звёздный рейтинг
✅ PriceBadge.astro    — Бейдж цены
✅ FeatureBadge.astro  — Бейдж фичи
✅ TagLink.astro       — Ссылка на тег
✅ TagList.astro       — Список тегов
✅ CTAButton.astro     — CTA-кнопка
✅ ProsConsList.astro  — Плюсы/минусы
✅ FeatureTable.astro  — Таблица характеристик
```

### Layouts (`/src/layouts/`)
```
✅ SiteLayout.astro    — Основной layout с Header/Footer и SEO
```

### Страницы (`/src/pages/`)
```
✅ index.astro         — Главная страница
✅ catalog.astro       — Каталог всех моделей
✅ models/[slug].astro — Динамическая страница модели
✅ tag/[tag].astro     — Страницы тегов (категорий)
```

### Content Collections (`/src/content/`)
```
✅ config.ts           — Zod-схемы данных
✅ models/candy-ai.yaml
✅ models/character-ai.yaml
✅ models/replika.yaml
```

---

## 14. СЛЕДУЮЩИЕ ШАГИ

1. **Добавить ещё 7 моделей** — довести до 10
2. **Создать страницы топов** — `/top/[slug].astro`
3. **Создать страницы сравнений** — `/compare/[slug].astro`
4. **Служебные страницы** — about, contacts, privacy, disclaimer
5. **Sitemap** — установить `@astrojs/sitemap`
6. **Деплой** — настроить Vercel/Cloudflare
