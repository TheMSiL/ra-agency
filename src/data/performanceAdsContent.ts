import type { Locale } from "@/i18n/config";

export type PerformanceAdsItem = { index: string; title: string; description: string };

const numbered = (items: Array<[string, string]>): PerformanceAdsItem[] =>
	items.map(([title, description], index) => ({ index: String(index + 1).padStart(2, "0"), title, description }));

export const googleAdsWhatWeDo: Record<Locale, PerformanceAdsItem[]> = {
	en: numbered([
		["Market & Competitor Research", "We analyze your business, competitors, search demand and market landscape to build a strategy tailored to your goals"],
		["Performance Strategy & Media Plan", "We create a growth strategy with campaign structure, budget allocation, KPI forecasts and realistic performance projections"],
		["Account & Tracking Setup", "We help set up your Google Ads account and configure GA4, GTM, Google Ads conversion tracking, call tracking and form tracking - ensuring every conversion is measured. Your account and data always remain yours"],
		["Ad & Asset Creation", "We build and optimize campaigns across Search, Shopping, Performance Max, YouTube and Display to maximize reach, conversion rate and ROAS across the entire Google ecosystem"],
		["Fast Campaign Launch", "Your campaigns go live within 24 hours after onboarding so you can start acquiring customers right away"],
		["Search Intent & Keyword Optimization", "We research high-intent keywords, build campaign structures, optimize bidding strategies and eliminate wasted spend to reach customers most likely to convert"],
		["Continuous A/B Testing", "We continuously test headlines, descriptions, keywords, landing pages, audiences, bidding strategies and campaign structures to improve CTR, CPA and ROAS"],
		["Scaling & Budget Optimization", "Once profitable campaigns are identified we strategically scale budgets while eliminating underperforming keywords, ads and placements to maximize ROAS without sacrificing efficiency"],
	]),
	ru: numbered([
		["Анализ рынка и конкурентов", "Мы анализируем ваш бизнес, конкурентов, поисковый спрос и рыночный ландшафт, чтобы построить стратегию, адаптированную под ваши цели"],
		["Стратегия эффективности и медиаплан", "Мы создаём стратегию роста со структурой кампаний, распределением бюджета, прогнозами KPI и реалистичными прогнозами эффективности"],
		["Настройка аккаунта и отслеживания", "Помогаем создать аккаунт Google Ads и настраиваем GA4, GTM, отслеживание конверсий Google Ads, отслеживание звонков и форм - обеспечивая измерение каждой конверсии. Ваш аккаунт и данные всегда остаются вашими"],
		["Создание рекламы и креативов", "Мы создаём и оптимизируем кампании в Search, Shopping, Performance Max, YouTube и Display, чтобы максимизировать охват, конверсию и ROAS во всей экосистеме Google"],
		["Быстрый запуск кампаний", "Ваши кампании запускаются в течение 24 часов после онбординга, чтобы вы могли сразу начать привлекать клиентов"],
		["Оптимизация поискового намерения и ключевых слов", "Мы исследуем высокоцелевые ключевые слова, строим структуру кампаний, оптимизируем стратегии ставок и устраняем нецелевые расходы, чтобы охватить клиентов с наибольшей вероятностью конверсии."],
		["Непрерывное A/B-тестирование", "Мы непрерывно тестируем заголовки, описания, ключевые слова, посадочные страницы, аудитории, стратегии ставок и структуры кампаний, чтобы повысить CTR, CPA и ROAS"],
		["Масштабирование и оптимизация бюджета", "После выявления прибыльных кампаний мы стратегически масштабируем бюджеты, устраняя неэффективные ключевые слова, объявления и площадки размещения, чтобы максимизировать ROAS без потери эффективности"],
	]),
	ua: numbered([
		["Аналіз ринку та конкурентів", "Ми аналізуємо ваш бізнес, конкурентів, пошуковий попит і ринковий ландшафт, щоб побудувати стратегію, адаптовану під ваші цілі"],
		["Стратегія ефективності та медіаплан", "Ми створюємо стратегію зростання зі структурою кампаній, розподілом бюджету, прогнозами KPI та реалістичними прогнозами ефективності"],
		["Налаштування акаунта та відстеження", "Допомагаємо створити акаунт Google Ads і налаштовуємо GA4, GTM, відстеження конверсій Google Ads, дзвінків і форм - забезпечуючи вимірювання кожної конверсії. Ваш акаунт і дані завжди залишаються вашими"],
		["Створення реклами та креативів", "Ми створюємо й оптимізуємо кампанії в Search, Shopping, Performance Max, YouTube і Display, щоб максимізувати охоплення, конверсію та ROAS у всій екосистемі Google"],
		["Швидкий запуск кампаній", "Ваші кампанії запускаються протягом 24 годин після онбордингу, щоб ви могли одразу почати залучати клієнтів"],
		["Оптимізація пошукового наміру та ключових слів", "Ми досліджуємо високорелевантні ключові слова, будуємо структуру кампаній, оптимізуємо стратегії ставок та усуваємо нецільові витрати, щоб охопити клієнтів із найбільшою ймовірністю конверсії."],
		["Безперервне A/B-тестування", "Ми безперервно тестуємо заголовки, описи, ключові слова, посадкові сторінки, аудиторії, стратегії ставок і структури кампаній, щоб підвищити CTR, CPA та ROAS"],
		["Масштабування та оптимізація бюджету", "Після виявлення прибуткових кампаній ми стратегічно масштабуємо бюджети, усуваючи неефективні ключові слова, оголошення та майданчики розміщення, щоб максимізувати ROAS без втрати ефективності"],
	]),
};

export const metaAdsWhatWeDo: Record<Locale, PerformanceAdsItem[]> = {
	en: numbered([
		["Market & Competitor Research", "We analyze your business, audience, competitors and Meta Ads Library to build a strategy tailored to your goals"],
		["Growth Strategy & KPI Planning", "We create a media plan with clear growth targets and performance goals based on CPA, ROAS, CAC and other key metrics"],
		["Business Manager Setup", "We guide you through setting up your Business Manager, ad account, payments and access to ensure a stable advertising infrastructure"],
		["Pixel & Conversion Tracking", "We help configure Meta Pixel, Conversions API and event tracking to provide accurate attribution and stronger optimization"],
		["Creative Strategy", "We prepare creative briefs, winning angles, hooks and recommendations for videos, statics and carousel ads built to perform"],
		["Campaign & Audience Structure", "We build scalable campaign structures with broad targeting, lookalikes, interests and retargeting audiences"],
		["Continuous A/B Testing", "We constantly test creatives, audiences, offers and campaign settings to improve performance and reduce acquisition costs"],
		["Scaling & Optimization", "We scale winning campaigns while instantly cutting underperforming ads to maximize ROAS and protect your budget"],
	]),
	ru: numbered([
		["Анализ рынка и конкурентов", "Мы анализируем ваш бизнес, аудиторию, конкурентов и Meta Ads Library, чтобы построить стратегию, адаптированную под ваши цели"],
		["Стратегия роста и планирование KPI", "Создаём медиаплан с чёткими целями роста и показателями эффективности на основе CPA, ROAS, CAC и других ключевых метрик"],
		["Настройка Business Manager", "Помогаем настроить Business Manager, рекламный аккаунт, платежи и доступы, чтобы обеспечить стабильную рекламную инфраструктуру"],
		["Настройка Pixel и отслеживания конверсий", "Мы помогаем настроить Meta Pixel, Conversions API и отслеживание событий для точной атрибуции и более эффективной оптимизации"],
		["Креативная стратегия", "Готовим креативные брифы, выигрышные подходы, хуки и рекомендации по видео, статичным креативам и каруселям, созданным для результата"],
		["Структура кампаний и аудиторий", "Строим масштабируемую структуру кампаний с широким таргетингом, look-alike аудиториями, интересами и ретаргетингом"],
		["Непрерывное A/B-тестирование", "Постоянно тестируем креативы, аудитории, офферы и настройки кампаний, чтобы повысить эффективность и снизить стоимость привлечения"],
		["Масштабирование и оптимизация", "Масштабируем прибыльные кампании, мгновенно отключая неэффективные объявления, чтобы максимизировать ROAS и защитить ваш бюджет"],
	]),
	ua: numbered([
		["Аналіз ринку та конкурентів", "Ми аналізуємо ваш бізнес, аудиторію, конкурентів і Meta Ads Library, щоб побудувати стратегію, адаптовану під ваші цілі"],
		["Стратегія зростання та планування KPI", "Створюємо медіаплан із чіткими цілями зростання та показниками ефективності на основі CPA, ROAS, CAC та інших ключових метрик"],
		["Налаштування Business Manager", "Допомагаємо налаштувати Business Manager, рекламний акаунт, платежі та доступи, щоб забезпечити стабільну рекламну інфраструктуру"],
		["Налаштування Pixel і відстеження конверсій", "Ми допомагаємо налаштувати Meta Pixel, Conversions API та відстеження подій для точної атрибуції та ефективнішої оптимізації"],
		["Креативна стратегія", "Готуємо креативні брифи, виграшні підходи, хуки та рекомендації щодо відео, статичних креативів і каруселей, створених для результату"],
		["Структура кампаній і аудиторій", "Будуємо масштабовану структуру кампаній із широким таргетингом, look-alike аудиторіями, інтересами та ретаргетингом"],
		["Безперервне A/B-тестування", "Постійно тестуємо креативи, аудиторії, офери та налаштування кампаній, щоб підвищити ефективність і знизити вартість залучення"],
		["Масштабування та оптимізація", "Масштабуємо прибуткові кампанії, миттєво відключаючи неефективні оголошення, щоб максимізувати ROAS і захистити ваш бюджет"],
	]),
};
