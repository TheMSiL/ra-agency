import type { Locale } from "@/i18n/config";

export type ServiceProcessItem = {
	index: string;
	title: string;
	description: string;
};

export const telegramAdsWhatWeDo: Record<Locale, ServiceProcessItem[]> = {
	en: [
		{ index: "01", title: "Market & Competitor Research", description: "We analyze your product, target audience, competitors and market landscape to build a strategy tailored to your business goals" },
		{ index: "02", title: "Media Planning & Forecasting", description: "We prepare a detailed media plan with audience segmentation, campaign structure, estimated performance metrics and realistic growth projections" },
		{ index: "03", title: "Creative Production", description: "We write high-converting ad copy and, when needed, design visuals optimized for Telegram Ads performance" },
		{ index: "04", title: "Advanced Analytics Setup", description: "We implement real-time analytics that track your entire acquisition funnel - from impressions and clicks to revenue, retention, repeat purchases and every KPI that matters" },
		{ index: "05", title: "Fast Campaign Launch", description: "Your campaigns go live within 24 hours after payment, allowing you to start acquiring customers without unnecessary delays" },
		{ index: "06", title: "Proprietary Targeting Database", description: "Instead of relying on standard Telegram targeting alone, we leverage our proprietary database of 15M+ Telegram channels to identify the audiences most likely to convert" },
		{ index: "07", title: "Creative A/B Testing", description: "We continuously test headlines, messaging, creatives and offers to maximize CTR, conversion rate and overall campaign performance" },
		{ index: "08", title: "Scaling Winning Campaigns", description: "Once we identify profitable combinations we aggressively scale them while instantly pausing underperforming campaigns to protect your budget and maximize ROAS" },
	],
	ru: [
		{ index: "01", title: "Анализ рынка и конкурентов", description: "Мы анализируем ваш продукт, целевую аудиторию, конкурентов и рыночный ландшафт, чтобы построить стратегию, адаптированную под цели вашего бизнеса" },
		{ index: "02", title: "Медиапланирование и прогнозирование", description: "Мы готовим подробный медиаплан с сегментацией аудитории, структурой кампаний, прогнозными показателями эффективности и реалистичными прогнозами роста" },
		{ index: "03", title: "Производство креативов", description: "Мы пишем высококонверсионные рекламные тексты и при необходимости разрабатываем визуалы, оптимизированные под эффективность в Telegram Ads" },
		{ index: "04", title: "Настройка продвинутой аналитики", description: "Мы внедряем аналитику в реальном времени, которая отслеживает всю воронку привлечения клиентов - от показов и кликов до дохода, удержания, повторных покупок и всех важных KPI" },
		{ index: "05", title: "Быстрый запуск кампаний", description: "Ваши кампании запускаются в течение 24 часов после оплаты, что позволяет начать привлекать клиентов без лишних задержек" },
		{ index: "06", title: "Собственная база таргетинга", description: "Вместо того чтобы полагаться только на стандартный таргетинг Telegram, мы используем собственную базу данных из более чем 15 млн Telegram-каналов, чтобы находить аудитории с наибольшей вероятностью конверсии" },
		{ index: "07", title: "A/B-тестирование креативов", description: "Мы непрерывно тестируем заголовки, месседжи, креативы и офферы, чтобы максимизировать CTR, конверсию и общую эффективность кампании" },
		{ index: "08", title: "Масштабирование успешных кампаний", description: "После выявления прибыльных связок мы агрессивно масштабируем их, мгновенно останавливая неэффективные кампании, чтобы защитить ваш бюджет и максимизировать ROAS" },
	],
	ua: [
		{ index: "01", title: "Аналіз ринку та конкурентів", description: "Ми аналізуємо ваш продукт, цільову аудиторію, конкурентів і ринковий ландшафт, щоб побудувати стратегію, адаптовану під цілі вашого бізнесу" },
		{ index: "02", title: "Медіапланування та прогнозування", description: "Ми готуємо детальний медіаплан із сегментацією аудиторії, структурою кампаній, прогнозними показниками ефективності та реалістичними прогнозами зростання" },
		{ index: "03", title: "Написання креативів", description: "Ми пишемо висококонверсійні рекламні тексти та за потреби розробляємо візуали, оптимізовані під ефективність у Telegram Ads" },
		{ index: "04", title: "Налаштування розширеної аналітики", description: "Ми впроваджуємо аналітику в реальному часі, яка відстежує всю воронку залучення клієнтів - від показів і кліків до доходу, утримання, повторних покупок і всіх важливих KPI" },
		{ index: "05", title: "Швидкий запуск кампаній", description: "Ваші кампанії запускаються протягом 24 годин після оплати, що дозволяє почати залучати клієнтів без зайвих затримок" },
		{ index: "06", title: "Власна база таргетингу", description: "Замість того щоб покладатися лише на стандартний таргетинг Telegram, ми використовуємо власну базу даних із понад 15 млн Telegram-каналів, щоб знаходити аудиторії з найбільшою ймовірністю конверсії" },
		{ index: "07", title: "A/B-тестування креативів", description: "Ми безперервно тестуємо заголовки, меседжі, креативи та офери, щоб максимізувати CTR, конверсію та загальну ефективність кампанії" },
		{ index: "08", title: "Масштабування успішних кампаній", description: "Після виявлення прибуткових зв'язок ми агресивно масштабуємо їх, миттєво зупиняючи неефективні кампанії, щоб захистити ваш бюджет і максимізувати ROAS" },
	],
};
