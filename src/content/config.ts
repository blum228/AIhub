/**
 * Content Collections — схемы данных AIGirlsHub
 * 
 * СМЫСЛОВАЯ СЕГМЕНТАЦИЯ:
 * - Уровень 1: motivation — основная потребность пользователя (Интим, Эскапизм, Связь)
 * - Уровень 1.5: formats — способы взаимодействия (текст, голос, визуал)
 * - Уровень 2: experienceTypes — какой тип опыта (романтика, хардкор, структурированный RP и т.д.)
 * - Уровень 3: advancedFeatures — уникальные фичи (таблица галочек)
 * - Уровень 4: productFit — для кого подходит / не подходит
 */
import { defineCollection, z, reference } from 'astro:content';

/**
 * Схема AI-модели (девушки)
 */
const modelsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // ═══════════════════════════════════════════════════════════════
    // ОСНОВНОЕ
    // ═══════════════════════════════════════════════════════════════
    name: z.string(),
    logo: z.string().optional(),
    rating: z.number().min(0).max(5),
    
    // Цена
    pricing: z.enum(['free', 'freemium', 'paid']),
    priceFrom: z.number().optional(),
    
    // Описание
    description: z.string(),
    tagline: z.string().optional(), // Короткая фраза-позиционирование
    content: z.string().optional(), // Полный обзор (Markdown)
    
    // Скриншоты интерфейса
    screenshots: z.array(z.string()).default([]),
    
    // Дата последнего обновления
    updatedAt: z.string().optional(), // ISO date string, e.g. "2025-12-01"
    
    // Плюсы/минусы
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),

    // ═══════════════════════════════════════════════════════════════
    // УРОВЕНЬ 1: МОТИВАЦИЯ ПОЛЬЗОВАТЕЛЯ
    // Основная потребность, которую закрывает сервис
    // ═══════════════════════════════════════════════════════════════
    motivation: z.enum([
      'intimacy',     // Интим: флирт, секс-чат, NSFW, романтика
      'escapism',     // Эскапизм: ролевые игры, персонажи, фантазии, сюжеты
      'connection',   // Связь: эмоциональная поддержка, дружба, разговоры
    ]).default('connection'),
    
    // Дополнительные мотивации (сервис может закрывать несколько потребностей)
    motivationSupport: z.array(z.enum([
      'intimacy', 'escapism', 'connection'
    ])).default([]),

    // ═══════════════════════════════════════════════════════════════
    // УРОВЕНЬ 1.5: ФОРМАТЫ ВЗАИМОДЕЙСТВИЯ
    // Способы, которыми пользователь может взаимодействовать с AI
    // ═══════════════════════════════════════════════════════════════
    formats: z.array(z.enum([
      'text',         // Текстовые чаты
      'voice',        // Голосовые звонки и сообщения
      'visual',       // Генерация изображений, аватары
    ])).default(['text']),

    // ═══════════════════════════════════════════════════════════════
    // УРОВЕНЬ 2: ТИП ОПЫТА
    // Какой именно experience даёт AI
    // ═══════════════════════════════════════════════════════════════
    experienceTypes: z.array(z.enum([
      // Для флирта/NSFW
      'slow-burn',      // Медленное развитие, романтика
      'explicit',       // Откровенные разговоры
      'gfe',            // Girlfriend Experience
      'fantasy',        // Dom/Sub, фетиши
      'erotic-story',   // Эротические истории
      
      // Для ролевых игр
      'lite-rp',        // Лёгкие сценки
      'structured-rp',  // Сюжет, арки, мир
      'kinky-rp',       // Узкие фетиши
      'high-improv',    // Быстрые респонсы, импровизация
      'character-accurate', // Точная ролевая личность
      'long-term-rp',   // Память, continuity
      
      // Для поддержки
      'therapy-lite',   // Поддержка, выслушивание
      'daily-companion', // Ежедневное общение
      'motivation',     // Мотивация, цели
      'loneliness',     // Борьба с одиночеством
    ])).default([]),

    // ═══════════════════════════════════════════════════════════════
    // УРОВЕНЬ 3: УНИКАЛЬНЫЕ ФИЧИ (для таблицы сравнения)
    // ═══════════════════════════════════════════════════════════════
    advancedFeatures: z.object({
      // Память
      memoryType: z.enum(['none', 'short', 'long', 'persistent']).default('short'),
      
      // Кастомизация
      personalityCustomization: z.boolean().default(false),
      customAvatar: z.boolean().default(false),
      
      // Голос
      voiceQuality: z.enum(['none', 'basic', 'realistic']).default('none'),
      
      // Мультимодальность
      multimodal: z.boolean().default(false),
      
      // Скорость
      responseSpeed: z.enum(['instant', 'fast', 'slow']).default('fast'),
      
      // Качество контента
      eroticQuality: z.enum(['none', 'basic', 'good', 'excellent']).default('none'),
      storyDepth: z.enum(['shallow', 'medium', 'deep']).default('medium'),
      
      // Ограничения
      censorship: z.enum(['strict', 'moderate', 'none']).default('moderate'),
      nsfwSupport: z.enum(['none', 'soft', 'full']).default('none'),
      
      // Дополнительно
      roleTypes: z.array(z.string()).default([]), // dom/sub, teacher/student, etc.
      hasMarketplace: z.boolean().default(false),
      hasGroupChats: z.boolean().default(false),
    }).default({}),

    // ═══════════════════════════════════════════════════════════════
    // УРОВЕНЬ 4: ПРОДУКТ-ФИТ (для кого подходит)
    // ═══════════════════════════════════════════════════════════════
    productFit: z.object({
      // Идеален для (3-5 пунктов)
      idealFor: z.array(z.string()).default([]),
      
      // Не подходит если (2-3 пункта)
      notFor: z.array(z.string()).default([]),
      
      // Альтернативы с причинами
      alternatives: z.array(z.object({
        slug: z.string(),
        reason: z.string(),
      })).default([]),
    }).default({}),
    
    // ═══════════════════════════════════════════════════════════════
    // СНГ-СПЕЦИФИКА (sng-redesign)
    // ═══════════════════════════════════════════════════════════════
    
    // Способы оплаты из РФ
    payment_methods: z.array(z.enum(['mir', 'sbp', 'crypto', 'foreign_card'])).default([]),
    
    // Работает без VPN в РФ
    vpn_required: z.boolean().default(true),
    
    // Платформы доступа
    platforms: z.array(z.enum(['web', 'ios', 'android', 'telegram'])).default(['web']),
    
    // Статус сервиса
    status: z.enum(['active', 'dead', 'censored']).default('active'),
    
    // Причина закрытия (для dead/censored)
    dead_reason: z.string().optional(),
    
    // Дата закрытия
    dead_date: z.string().optional(),
    
    // GIF-превью для hover
    gif_preview: z.string().optional(),
    
    // Гайд по оплате из РФ (если нет карт РФ)
    payment_guide: z.string().optional(),

    // ═══════════════════════════════════════════════════════════════
    // СТАРЫЕ ПОЛЯ (для обратной совместимости)
    // ═══════════════════════════════════════════════════════════════
    
    // Базовые фичи (оставляем для простых фильтров)
    features: z.object({
      voice: z.boolean().default(false),
      nsfw: z.boolean().default(false),
      russian: z.boolean().default(false),
      imageGen: z.boolean().default(false),
      roleplay: z.boolean().default(false),
      telegram: z.boolean().default(false),
      api: z.boolean().default(false),
    }).default({}),
    
    // Теги для фильтрации
    tags: z.array(z.string()).default([]),
    
    // Ссылки
    affiliateUrl: z.string().url(),
    websiteUrl: z.string().url().optional(),
    
    // SEO
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).default({}),
    
    // Мета
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

// Топы удалены — функционал объединён с /for/[goal]

/**
 * Схема сравнения
 */
const comparisonsCollection = defineCollection({
  type: 'content', // Markdown с frontmatter
  schema: z.object({
    title: z.string(),
    
    // Две модели для сравнения (slug'и)
    modelA: z.string(),
    modelB: z.string(),
    
    // Вердикт
    verdict: z.string(),
    winner: z.enum(['a', 'b', 'tie']).optional(),
    
    // SEO
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).default({}),
    
    // Мета
    publishedAt: z.date().optional(),
  }),
});

export const collections = {
  models: modelsCollection,
  comparisons: comparisonsCollection,
};
