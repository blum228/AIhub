# ФАЗА 5: SEO И ТЕХНИЧЕСКОЕ

> **Приоритет:** 🟡 Средний  
> **Время:** ~2-4 часа  
> **Цель:** Оптимизировать для поисковиков и стабильности

---

## Задачи

### 5.1 ✅ Установить и настроить sitemap
**Файл:** `astro.config.mjs`

**Установка:**
```bash
npm install @astrojs/sitemap
```

**Настройка:**
```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aigirlshub.com', // Заменить на реальный домен
  integrations: [sitemap()],
});
```

---

### 5.2 ✅ Создать robots.txt
**Файл:** `public/robots.txt`

```txt
User-agent: *
Allow: /

# Исключить служебные страницы
Disallow: /ids-docs
Disallow: /story

# Sitemap
Sitemap: https://aigirlshub.com/sitemap-index.xml
```

---

### 5.3 ✅ Проверить canonical URL
**Файл:** `src/layouts/SiteLayout.astro`

**Проверить:**
```astro
<link rel="canonical" href={Astro.url.href} />
```

**Убедиться что `Astro.site` настроен в `astro.config.mjs`:**
```javascript
export default defineConfig({
  site: 'https://aigirlshub.com',
});
```

---

### 5.4 ✅ Включить TypeScript strict
**Файл:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**После включения:** Исправить все ошибки типов.

```bash
npx tsc --noEmit
```

---

### 5.5 ✅ Создать уникальные OG-картинки
**Директория:** `public/images/og/`

**Текущее:** Одна картинка `/images/og/default.jpg` для всех страниц.

**Решение (простое):**
1. Создать OG-картинки для каждой модели вручную
2. Обновить meta-теги на страницах моделей

**Решение (продвинутое):**
1. Использовать Satori или @vercel/og для динамической генерации
2. Настроить endpoint `/og/[slug].png`

**Структура:**
```
public/images/og/
├── default.jpg
├── candy-ai.jpg
├── character-ai.jpg
├── replika.jpg
└── ...
```

---

### 5.6 ✅ Добавить обработку ошибок в getCollection
**Файлы:** Страницы с `getCollection`

**Текущее:** Нет try/catch, сайт падает при некорректных данных.

**Решение:**
```astro
---
import { getCollection } from 'astro:content';

let models = [];
try {
  models = await getCollection('models');
} catch (error) {
  console.error('Error loading models:', error);
  models = [];
}
---
```

---

### 5.7 ✅ Проверить meta-теги
**Файл:** `src/layouts/SiteLayout.astro`

**Обязательные теги:**
```html
<title>{title}</title>
<meta name="description" content="{description}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="{canonicalUrl}" />

<!-- Open Graph -->
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:image" content="{ogImage}" />
<meta property="og:url" content="{canonicalUrl}" />
<meta property="og:type" content="website" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{description}" />
<meta name="twitter:image" content="{ogImage}" />
```

---

### 5.8 ✅ Добавить Schema.org разметку
**Файлы:** Страницы моделей, сравнений

**Для страницы модели (Product):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{model.name}",
  "description": "{model.description}",
  "image": "{model.logo}",
  "url": "{pageUrl}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{model.rating}",
    "reviewCount": "1"
  }
}
</script>
```

---

## Команды для проверки

```bash
# Проверка TypeScript
npx tsc --noEmit

# Сборка проекта
npm run build

# Проверка sitemap (после сборки)
cat dist/sitemap-index.xml

# Валидация Schema.org
# https://validator.schema.org/
```

---

## Чеклист завершения

- [ ] Sitemap генерируется автоматически
- [ ] robots.txt создан и корректен
- [ ] Canonical URL настроен
- [ ] TypeScript strict включён, ошибки исправлены
- [ ] OG-картинки созданы (минимум default)
- [ ] Обработка ошибок в getCollection
- [ ] Meta-теги на всех страницах
- [ ] Schema.org разметка валидна

---

*После завершения → переходи к PHASE-6-FUTURE.md (опционально)*
