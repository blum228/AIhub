# Requirements Document

## Introduction

Редизайн AIGirlsHub под СНГ-рынок — трансформация сайта-агрегатора AI-компаньонов с фокусом на русскоязычную аудиторию. Проект включает: расширенную систему фильтров с СНГ-специфичными критериями (оплата картой РФ, работа без VPN, Telegram-боты), улучшенные карточки товаров с GIF-превью и бейджами, Safe Mode для размытия контента, и SEO-оптимизацию под Яндекс.

**Технический стек:** Все компоненты реализуются на базе IDS (Intuition Design System) — https://intuition-tech.github.io/ids/#intro. Используются существующие токены из `src/styles/tokens.css`, классы из `src/styles/ids.css`, и цветовая схема из `src/styles/colors.css`.

## Glossary

- **Catalog_System**: Система отображения и фильтрации AI-сервисов на сайте
- **Filter_Panel**: Боковая панель с чекбоксами для фильтрации сервисов
- **Service_Card**: Карточка отдельного AI-сервиса в каталоге
- **Safe_Mode**: Режим размытия откровенного контента ("Я на работе")
- **Badge**: Визуальный индикатор характеристики сервиса (Free, NSFW, RU и т.д.)
- **GIF_Preview**: Анимированное превью при наведении на карточку
- **Payment_Method**: Способ оплаты (карта РФ/Мир/СБП, крипто, иностранная карта)
- **Platform**: Платформа доступа к сервису (Web, iOS, Android, Telegram)
- **Dead_AI**: Сервис, который закрылся или ввёл жёсткую цензуру

## Requirements

### Requirement 1: Расширенная система фильтров

**User Story:** As a пользователь из СНГ, I want фильтровать AI-сервисы по критериям, важным для моего региона, so that я могу быстро найти подходящий сервис без лишних проб.

#### Acceptance Criteria

1. WHEN пользователь открывает страницу каталога THEN Catalog_System SHALL отображать Filter_Panel слева от списка сервисов на десктопе
2. WHEN пользователь выбирает фильтр "Оплата картой РФ" THEN Catalog_System SHALL показывать только сервисы с payment_methods содержащим "mir" или "sbp"
3. WHEN пользователь выбирает фильтр "Без VPN" THEN Catalog_System SHALL показывать только сервисы с полем vpn_required равным false
4. WHEN пользователь выбирает фильтр "Telegram" THEN Catalog_System SHALL показывать только сервисы с platform содержащим "telegram"
5. WHEN пользователь выбирает несколько фильтров одновременно THEN Catalog_System SHALL применять логическое AND ко всем выбранным фильтрам
6. WHEN пользователь на мобильном устройстве THEN Filter_Panel SHALL отображаться как выдвижная панель по нажатию кнопки "Фильтры"

### Requirement 2: Категории фильтров по смыслу

**User Story:** As a пользователь, I want видеть фильтры сгруппированными по смыслу, so that я могу быстро ориентироваться в опциях.

#### Acceptance Criteria

1. WHEN Filter_Panel отображается THEN Catalog_System SHALL группировать фильтры в секции: "Основной смысл", "Фичи", "Платформа", "Оплата"
2. WHEN секция "Основной смысл" отображается THEN Catalog_System SHALL содержать опции: "18+", "Ролеплей", "Психология/Поддержка"
3. WHEN секция "Фичи" отображается THEN Catalog_System SHALL содержать опции: "Супер-память", "Генерация фото", "Голосовые сообщения", "Свой сценарий", "Понимает русский"
4. WHEN секция "Платформа" отображается THEN Catalog_System SHALL содержать опции: "Web", "iOS", "Android", "Telegram"
5. WHEN секция "Оплата" отображается THEN Catalog_System SHALL содержать опции: "Бесплатно", "Карта РФ/Мир", "Крипто"

### Requirement 3: Улучшенные карточки сервисов

**User Story:** As a пользователь, I want видеть больше информации о сервисе прямо в карточке, so that я могу принять решение без перехода на детальную страницу.

#### Acceptance Criteria

1. WHEN Service_Card отображается THEN Catalog_System SHALL показывать: название, рейтинг, краткое описание, бейджи, цену
2. WHEN пользователь наводит курсор на Service_Card THEN Catalog_System SHALL показывать GIF_Preview или анимированный скриншот чата в течение 200ms
3. WHEN сервис бесплатный THEN Service_Card SHALL отображать Badge с текстом "Free" зелёного цвета
4. WHEN сервис поддерживает NSFW THEN Service_Card SHALL отображать Badge с текстом "18+" красного цвета
5. WHEN сервис имеет persistent память THEN Service_Card SHALL отображать Badge с текстом "Память" синего цвета
6. WHEN сервис принимает карты РФ THEN Service_Card SHALL отображать Badge с текстом "Мир" с иконкой карты

### Requirement 4: Safe Mode (Режим "Я на работе")

**User Story:** As a пользователь, I want скрывать откровенный контент одним кликом, so that я могу просматривать сайт в публичных местах.

#### Acceptance Criteria

1. WHEN пользователь находится на любой странице сайта THEN Catalog_System SHALL отображать переключатель Safe_Mode в шапке
2. WHEN Safe_Mode активирован THEN Catalog_System SHALL применять CSS blur(10px) ко всем изображениям с классом "nsfw-content"
3. WHEN Safe_Mode активирован THEN Catalog_System SHALL скрывать Badge с текстом "18+"
4. WHEN Safe_Mode деактивирован THEN Catalog_System SHALL показывать весь контент без размытия
5. WHEN пользователь переключает Safe_Mode THEN Catalog_System SHALL сохранять состояние в localStorage

### Requirement 5: Раздел Dead AI

**User Story:** As a пользователь, I want знать какие сервисы закрылись или ввели цензуру, so that я не трачу время на нерабочие варианты.

#### Acceptance Criteria

1. WHEN сервис помечен как dead THEN Service_Card SHALL отображать визуальный индикатор "Закрыт" или "Цензура" серого цвета
2. WHEN сервис помечен как dead THEN Service_Card SHALL отображаться с пониженной opacity (0.6)
3. WHEN пользователь переходит на страницу dead сервиса THEN Catalog_System SHALL показывать баннер с причиной закрытия и датой
4. WHEN Filter_Panel отображается THEN Catalog_System SHALL содержать чекбокс "Показать закрытые" (по умолчанию выключен)
5. WHEN чекбокс "Показать закрытые" выключен THEN Catalog_System SHALL скрывать все сервисы с status равным "dead"

### Requirement 6: Расширенная схема данных модели

**User Story:** As a контент-менеджер, I want хранить СНГ-специфичные данные о сервисах, so that фильтры и карточки работают корректно.

#### Acceptance Criteria

1. WHEN модель сервиса создаётся THEN Catalog_System SHALL поддерживать поле payment_methods типа массив строк
2. WHEN модель сервиса создаётся THEN Catalog_System SHALL поддерживать поле vpn_required типа boolean
3. WHEN модель сервиса создаётся THEN Catalog_System SHALL поддерживать поле platforms типа массив enum (web, ios, android, telegram)
4. WHEN модель сервиса создаётся THEN Catalog_System SHALL поддерживать поле status типа enum (active, dead, censored)
5. WHEN модель сервиса создаётся THEN Catalog_System SHALL поддерживать поле dead_reason типа string (опционально)
6. WHEN модель сервиса создаётся THEN Catalog_System SHALL поддерживать поле gif_preview типа string URL (опционально)

### Requirement 7: Гайды по оплате

**User Story:** As a пользователь из РФ, I want видеть инструкции по оплате иностранных сервисов, so that я могу оплатить подписку несмотря на санкции.

#### Acceptance Criteria

1. WHEN сервис не принимает карты РФ напрямую THEN страница сервиса SHALL отображать секцию "Как оплатить из РФ"
2. WHEN секция "Как оплатить из РФ" отображается THEN Catalog_System SHALL показывать пошаговую инструкцию с вариантами (крипто, посредники)
3. WHEN сервис принимает карты РФ THEN секция "Как оплатить из РФ" SHALL не отображаться

### Requirement 8: SEO-оптимизация под Яндекс

**User Story:** As a владелец сайта, I want оптимизировать сайт под Яндекс, so that я получаю органический трафик из русскоязычного поиска.

#### Acceptance Criteria

1. WHEN страница сервиса отображается THEN Catalog_System SHALL включать микроразметку Schema.org Product с AggregateRating
2. WHEN страница каталога отображается THEN Catalog_System SHALL включать FAQ-секцию с вопросами в формате "Можно ли...", "Есть ли..."
3. WHEN страница генерируется THEN Catalog_System SHALL использовать русскоязычные мета-теги title и description
4. WHEN страница сервиса отображается THEN Catalog_System SHALL включать мини-FAQ с ответами на частые вопросы о сервисе

### Requirement 9: Тёмная тема по умолчанию

**User Story:** As a пользователь, I want видеть сайт в тёмной теме, so that интерфейс соответствует стандартам 18+ и гейминг-ниши.

#### Acceptance Criteria

1. WHEN пользователь открывает сайт впервые THEN Catalog_System SHALL отображать тёмную цветовую схему
2. WHEN тёмная тема активна THEN фон страницы SHALL иметь цвет в диапазоне #0a0a0a - #1a1a1a
3. WHEN тёмная тема активна THEN текст SHALL иметь цвет в диапазоне #e0e0e0 - #ffffff
4. WHEN тёмная тема активна THEN акцентный цвет SHALL быть контрастным (минимум 4.5:1 по WCAG)

### Requirement 10: Использование IDS (Intuition Design System)

**User Story:** As a разработчик, I want использовать единую дизайн-систему IDS, so that интерфейс консистентен и легко поддерживается.

#### Acceptance Criteria

1. WHEN компонент создаётся THEN Catalog_System SHALL использовать CSS-переменные из tokens.css (--ids__space-*, --ids__font-size-*, --ids__radius-*)
2. WHEN компонент создаётся THEN Catalog_System SHALL использовать семантические цвета из tokens.css (--ids__text-*, --ids__bg-*, --ids__border-*)
3. WHEN текстовый элемент создаётся THEN Catalog_System SHALL применять классы из ids.css (.ids h1, .ids h2, .ids p и т.д.)
4. WHEN интерактивный элемент создаётся THEN Catalog_System SHALL использовать transition-переменные (--ids__transition-fast, --ids__transition-normal)
5. WHEN компонент адаптируется под мобильные THEN Catalog_System SHALL использовать брейкпоинты IDS (600px, 900px, 1200px)
