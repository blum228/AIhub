# IDS Astro

Intuition Design System — шаблон Astro для вёрстки лендингов, онлайн-изданий и цифровых продуктов.

## Структура проекта

```
src/
├── components/         # Astro-компоненты
│   ├── Space.astro          # Вертикальные отступы (S, M, L, XL)
│   ├── Wrapper.astro        # Обёртка страницы (L, XL, XXL)
│   ├── TextWidth.astro      # Текстовая колонка
│   ├── Section.astro        # Секция страницы
│   ├── Sequence.astro       # Flex-сетка
│   ├── SequenceItem.astro   # Элемент сетки
│   ├── Aside.astro          # Информационная плашка
│   ├── PromoLink.astro      # Группа ссылок
│   ├── Rounded.astro        # Скруглённые углы (суперэллипс)
│   ├── ColorPlate.astro     # Цветовая плашка
│   ├── Navbar.astro         # Навигация по секциям
│   ├── NavItem.astro        # Элемент навигации
│   ├── Gallery.astro        # PhotoSwipe галерея
│   ├── GalleryItem.astro    # Элемент галереи
│   ├── InlineGallery.astro  # Слайдер по движению курсора
│   ├── Sleepy.astro         # Анимация появления при скролле
│   ├── Footnote.astro       # Сноска
│   └── FootnoteLink.astro   # Ссылка на сноску
├── layouts/
│   └── BaseLayout.astro     # Базовый layout
├── pages/
│   └── index.astro          # Демо-страница
└── styles/                  # CSS дизайн-системы
    ├── colors.css           # Цветовая палитра
    ├── settings.css         # Шрифты, плотность, радиус
    ├── layout.css           # Структурные классы
    ├── ids.css              # Стилизация тегов
    └── ...

public/
├── fonts/                   # PT Root UI
├── images/                  # Изображения
└── js/lib/                  # PhotoSwipe
```

## Использование

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Space from '../components/Space.astro';
import Wrapper from '../components/Wrapper.astro';
import TextWidth from '../components/TextWidth.astro';
---

<BaseLayout title="Моя страница">
  <Wrapper>
    <Space size="XL" />
    <TextWidth>
      <h1>Заголовок</h1>
      <p>Текст страницы</p>
    </TextWidth>
  </Wrapper>
</BaseLayout>
```

## Команды

| Команда           | Действие                              |
| :---------------- | :------------------------------------ |
| `npm install`     | Установка зависимостей                |
| `npm run dev`     | Dev-сервер на `localhost:4321`        |
| `npm run build`   | Сборка в `./dist/`                    |
| `npm run preview` | Превью сборки                         |

## Лицензия

MIT — можно бесплатно использовать и модифицировать.
