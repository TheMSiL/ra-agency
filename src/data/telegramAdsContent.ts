import type { Locale } from "@/i18n/config";

export type ServiceProcessItem = {
	index: string;
	title: string;
	description: string;
};

export const telegramAdsWhatWeDo: Record<Locale, ServiceProcessItem[]> = {
	en: [
		{ index: "01", title: "Market & Competitor Research", description: "We analyze your product, target audience, competitors, and market landscape to build a strategy tailored to your business goals." },
		{ index: "02", title: "Media Planning & Forecasting", description: "We prepare a detailed media plan with audience segmentation, campaign structure, estimated performance metrics, and realistic growth projections." },
		{ index: "03", title: "Creative Production", description: "We write high-converting ad copy and, when needed, design visuals that are optimized for Telegram Ads performance." },
		{ index: "04", title: "Advanced Analytics Setup", description: "We implement real-time analytics that tracks your entire acquisition funnel—from impressions and clicks to revenue, retention, repeat purchases, and every KPI that matters." },
		{ index: "05", title: "Fast Campaign Launch", description: "Your campaigns go live within 24 hours after payment, allowing you to start acquiring customers without unnecessary delays." },
		{ index: "06", title: "Proprietary Targeting Database", description: "Instead of relying on standard Telegram targeting alone, we leverage our proprietary database of 15M+ Telegram channels to identify the audiences most likely to convert." },
		{ index: "07", title: "Creative A/B Testing", description: "We continuously test headlines, messaging, creatives, and offers to maximize CTR, conversion rates, and overall campaign performance." },
		{ index: "08", title: "Scaling Winning Campaigns", description: "Once we identify profitable combinations, we aggressively scale them while instantly pausing underperforming campaigns to protect your budget and maximize ROAS." },
	],
	ru: [
		{ index: "01", title: "Исследование рынка и конкурентов", description: "Анализируем ваш продукт, целевую аудиторию, конкурентов и рынок, чтобы разработать стратегию под цели вашего бизнеса." },
		{ index: "02", title: "Медиапланирование и прогнозирование", description: "Готовим детальный медиаплан с сегментацией аудитории, структурой кампаний, прогнозными показателями и реалистичным планом роста." },
		{ index: "03", title: "Создание креативов", description: "Пишем конверсионные рекламные тексты и при необходимости создаём визуалы, оптимизированные под эффективность Telegram Ads." },
		{ index: "04", title: "Настройка продвинутой аналитики", description: "Внедряем аналитику в реальном времени для всей воронки привлечения — от показов и кликов до выручки, удержания, повторных покупок и каждого значимого KPI." },
		{ index: "05", title: "Быстрый запуск кампаний", description: "Запускаем кампании в течение 24 часов после оплаты, чтобы вы начали привлекать клиентов без лишних задержек." },
		{ index: "06", title: "Собственная база для таргетинга", description: "Не ограничиваемся стандартным таргетингом Telegram: используем собственную базу из 15+ млн Telegram-каналов, чтобы находить аудитории с наибольшей вероятностью конверсии." },
		{ index: "07", title: "A/B-тестирование креативов", description: "Постоянно тестируем заголовки, сообщения, креативы и офферы, чтобы повышать CTR, конверсию и общую эффективность кампаний." },
		{ index: "08", title: "Масштабирование успешных кампаний", description: "Выявив прибыльные комбинации, активно масштабируем их и сразу останавливаем неэффективные кампании, защищая бюджет и максимизируя ROAS." },
	],
	ua: [
		{ index: "01", title: "Дослідження ринку та конкурентів", description: "Аналізуємо ваш продукт, цільову аудиторію, конкурентів і ринок, щоб розробити стратегію відповідно до цілей вашого бізнесу." },
		{ index: "02", title: "Медіапланування та прогнозування", description: "Готуємо детальний медіаплан із сегментацією аудиторії, структурою кампаній, прогнозними показниками та реалістичним планом зростання." },
		{ index: "03", title: "Створення креативів", description: "Пишемо конверсійні рекламні тексти та за потреби створюємо візуали, оптимізовані для ефективної роботи Telegram Ads." },
		{ index: "04", title: "Налаштування поглибленої аналітики", description: "Впроваджуємо аналітику в реальному часі для всієї воронки залучення — від показів і кліків до доходу, утримання, повторних покупок і кожного важливого KPI." },
		{ index: "05", title: "Швидкий запуск кампаній", description: "Запускаємо кампанії протягом 24 годин після оплати, щоб ви почали залучати клієнтів без зайвих затримок." },
		{ index: "06", title: "Власна база для таргетингу", description: "Не обмежуємося стандартним таргетингом Telegram: використовуємо власну базу з понад 15 млн Telegram-каналів, щоб знаходити аудиторії з найвищою ймовірністю конверсії." },
		{ index: "07", title: "A/B-тестування креативів", description: "Постійно тестуємо заголовки, повідомлення, креативи й офери, щоб підвищувати CTR, конверсію та загальну ефективність кампаній." },
		{ index: "08", title: "Масштабування успішних кампаній", description: "Визначивши прибуткові комбінації, активно масштабуємо їх і відразу зупиняємо неефективні кампанії, захищаючи бюджет та максимізуючи ROAS." },
	],
};
