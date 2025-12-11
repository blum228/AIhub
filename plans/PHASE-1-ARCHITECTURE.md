# ФАЗА 1: АРХИТЕКТУРА

> **Приоритет:** 🟠 Средний  
> **Время:** ~4-6 часов  
> **Цель:** Навести порядок в компонентах и структуре

---

## Задачи

### 1.1 ✅ Аудит неиспользуемых компонентов
**Директория:** `src/components/`

**Проверить использование:**
```bash
grep -r "Hero.astro" src/pages/
grep -r "ModelCard.astro" src/pages/
grep -r "TopListItem" src/pages/
grep -r "QuickPick" src/pages/
grep -r "CategoryCards" src/pages/
grep -r "VerdictBox" src/pages/
```

**Кандидаты на удаление:**
- `TopListItem.astro` — топы удалены
- `ModelCard.astro` — если дублирует ModelCardSemantic
- `CategoryCards.astro` — если не используется
- `Hero.astro` — если не используется на главной

---

### 1.2 ✅ Унифицировать ModelCard
**Файлы:** 
- `src/components/ModelCard.astro`
- `src/components/ModelCardSemantic.astro`

**Проблема:** Два компонента для одной задачи.

**Решение:**
1. Проверить где используется каждый
2. Удалить `ModelCard.astro` если не используется
3. Переименовать `ModelCardSemantic.astro` → `ModelCard.astro`
4. Обновить все импорты

---

### 1.3 ✅ Создать страницу 404
**Файл:** `src/pages/404.astro`

**Создать:**
```astro
---
import SiteLayout from '../layouts/SiteLayout.astro';
import Wrapper from '../components/Wrapper.astro';
import Space from '../components/Space.astro';
import CTAButton from '../components/CTAButton.astro';
---

<SiteLayout title="Страница не найдена — AIGirlsHub">
  <Space size="XL" />
  <Wrapper>
    <div class="error-page">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Space size="L" />
      <div class="error-page__actions">
        <CTAButton href="/" text="На главную" variant="primary" />
        <CTAButton href="/catalog" text="Каталог" variant="secondary" />
      </div>
    </div>
  </Wrapper>
  <Space size="XL" />
</SiteLayout>

<style>
.error-page {
  text-align: center;
  padding: var(--ids__space-xl) 0;
}
.error-page h1 {
  font-size: 6rem;
  color: var(--ids__text-muted);
}
.error-page p {
  font-size: 1.5rem;
  color: var(--ids__text-secondary);
}
.error-page__actions {
  display: flex;
  gap: var(--ids__space-m);
  justify-content: center;
}
</style>
```

---

### 1.4 ✅ Проверить все внутренние ссылки
**Команда:**
```bash
# Найти все href в проекте
grep -r "href=\"/" src/ --include="*.astro"

# Проверить существование страниц
ls src/pages/
```

**Проверить:**
- [ ] `/top/*` — должны быть удалены
- [ ] `/tag/*` — должны быть заменены на `/catalog/*`
- [ ] Все ссылки в Header
- [ ] Все ссылки в Footer

---

### 1.5 ✅ Упростить навигацию
**Файлы:** `Header.astro`, `index.astro`

**Проблема:** 4 способа попасть в каталог — избыточно.

**Решение:**
- Header: "Выбрать AI" dropdown → `/for/[goal]`
- Header: "Все сервисы" → `/catalog`
- Главная: карточки целей → `/for/[goal]`
- Убрать дублирующие CTA

---

## Файлы для удаления (после проверки)

```
src/pages/ids-docs.astro          — уже удалён в Фазе 0
src/pages/story.astro             — уже удалён в Фазе 0
src/components/TopListItem.astro  — если не используется
src/components/ModelCard.astro    — если дублирует
```

---

## Чеклист завершения

- [x] Неиспользуемые компоненты удалены (15 шт)
- [x] ModelCard унифицирован (ModelCardSemantic)
- [x] Страница 404 создана и работает
- [x] Все внутренние ссылки проверены (нет /top/, /tag/)
- [x] Навигация упрощена
- [x] `npm run build` проходит без ошибок (30 страниц)

---

*После завершения → переходи к PHASE-2-DESIGN.md*
