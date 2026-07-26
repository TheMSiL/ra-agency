export const locales = [
	{ code: 'en', label: 'EN', htmlLang: 'en' },
	{ code: 'ru', label: 'RU', htmlLang: 'ru' },
	{ code: 'ua', label: 'UA', htmlLang: 'uk' },
] as const;

export type Locale = (typeof locales)[number]['code'];

export const defaultLocale = 'en' satisfies Locale;

const en = {
	'language.switcherLabel': 'Choose language',
	'language.en': 'English',
	'language.ru': 'Russian',
	'language.ua': 'Ukrainian',
	'nav.home': 'Home',
	'nav.about': 'About us',
	'nav.cases': 'Cases',
	'nav.blog': 'Blog',
	'nav.contacts': 'Contacts',
	'nav.google': 'Google Ads',
	'nav.telegram': 'Telegram Ads',
	'nav.meta': 'Meta Ads',
	'nav.open': 'Open menu',
	'nav.close': 'Close menu',
	'nav.main': 'Main menu',
	'common.readMore': 'Read more',
	'common.seeMore': 'See more',
	'common.message': 'Message us on Telegram',
	'common.previous': 'Previous page',
	'common.next': 'Next page',
	'common.page': 'Page',
	'hero.heading': 'Performance marketing',
	'hero.text': 'We don’t buy clicks. We take minds.',
	'hero.next': 'What we do',
	'hero.telegramText':
		'We launch, optimize, and scale official Telegram Ads with a laser focus on hard metrics. No vanity metrics — only verified signups, active deposits, and player purchases.',
	'hero.metaText':
		'We build and scale performance campaigns across Facebook and Instagram, optimizing every step of the funnel for conversions, CPA, and ROAS.',
	'hero.googleText':
		'We launch and scale Google Ads with a focus on real results — leads, purchases, and revenue growth. We work with products where the goal is not just traffic, but paying customers.',
	'numbers.title': 'Numbers We Stand Behind',
	'numbers.intro': 'Every number reflects campaigns that deliver real results.',
	'numbers.cost.title': 'Average cost per user',
	'numbers.cost.text':
		'Competitive cost per user with the right funnel and strategy',
	'numbers.users.title': 'Users from Telegram Ads',
	'numbers.users.text':
		'A steady stream of new users from Telegram Ads for active projects every month',
	'numbers.clients.title': 'Active clients',
	'numbers.clients.text':
		'Long-term partnerships with clients, not one-time campaigns',
	'numbers.budget.title': 'Managed advertising budget',
	'numbers.budget.text':
		'We manage advertising budgets at scale while maintaining performance control',
	'cases.title': 'Case Studies and Success Stories',
	'cases.subtitle':
		'Examples of advertising campaigns we launched and scaled for our clients',
	'cases.other': 'View other projects',
	'cases.catalog': 'Our Cases',
	'cases.search': 'Search...',
	'cases.empty': 'No cases found',
	'cases.problem': 'The Problem:',
	'cases.fix': 'Our Fix:',
	'cases.work': 'The Work:',
	'cases.triumph': 'The Triumph:',
	'cases.results': 'Results',
	'cases.read': 'Read case',
	'cases.filters': 'Filters',
	'cases.telegram': 'Telegram Ads',
	'cases.google': 'Google Ads',
	'cases.meta': 'Meta Ads',
	'trust.title': 'We’re trusted by',
	'reviews.title': 'Reviews',
	'talk.title': 'Are you ready to talk?',
	'about.title': 'ABOUT US',
	'about.pioneering': 'Pioneering the digital space since 2024',
	'about.pioneeringText':
		'We are a team of performance marketers, strategists, and growth specialists focused on scalable growth. We analyze products, test hypotheses, launch campaigns, and optimize them based on data. Every decision is built around ROI, unit economics, and long-term performance. We don’t look for magic buttons — we build systems that scale.',
	'about.core.title': 'CORE EXPERTISE',
	'about.core.text':
		'RA Agency is a performance marketing agency that helps brands scale growth through Telegram Ads, Meta Ads, Google Ads, influencer marketing, and conversion-driven funnels',
	'about.philosophy.title': 'OUR PHILOSOPHY',
	'about.philosophy.text':
		'We ignore vanity metrics like clicks and impressions. Our focus is your unit economics. We design automated, data-driven acquisition systems that consistently deliver scalable, predictable revenue growth',
	'about.partnership.title': 'GROWTH PARTNERSHIP',
	'about.partnership.text':
		'We act as an extension of your in-house team, not just a third-party vendor. You get full, real-time access to live dashboards, transparent ad accounts, and direct communication',
	'about.niches.title': 'TARGET NICHES',
	'about.niches.text':
		'We work with Web3, gaming, iGaming, and digital products where success is measured not by clicks, but by real users, conversions, and revenue growth',
	'blog.title': 'Our blog',
	'blog.empty': 'No articles published yet',
	'blog.subscribeTitle':
		'Subscribe to our newsletter for regular quality insights',
	'blog.subscribe': 'Subscribe',
	'blog.follow': 'Follow us',
	'blog.keepExploring': 'Keep exploring',
	'blog.recommended': 'Recommended articles',
	'blog.readArticle': 'Read article',
	'blog.minRead': 'min read',
	'blog.views': 'views',
	'contact.title': 'Contacts',
	'contact.intro':
		'Have a project in mind or want to scale what already works? Pick the channel that suits you — we are always within reach.',
	'contact.mark': 'Let’s build growth together',
	'form.title': 'Let’s Connect And Talk',
	'form.name': 'Name',
	'form.method': 'Preferred contact method',
	'form.telegramUser': 'Telegram Username',
	'form.details': 'Details',
	'form.submit': 'Get started',
	'form.close': 'Close form',
	'footer.text':
		'Performance marketing partner for high-growth brands. We build and scale acquisition systems with predictable ROI across Telegram Ads, Meta, Google, and beyond.',
	'footer.navigation': 'Navigation',
	'footer.services': 'Services',
	'footer.legal': 'Legal',
	'footer.privacy': 'Privacy Policy',
	'footer.terms': 'Terms of Service',
	'footer.cookies': 'Cookie Policy',
	'consent.title': 'Analytics cookies',
	'consent.text':
		'We use analytics cookies to understand traffic sources and improve the website.',
	'consent.accept': 'Accept',
	'consent.reject': 'Reject',
} as const;

export type TranslationKey = keyof typeof en;

export const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
	en,
	ru: {
		'consent.title': 'Аналитические cookie',
		'consent.text':
			'Мы используем аналитические cookie, чтобы понимать источники трафика и улучшать сайт.',
		'consent.accept': 'Принять',
		'consent.reject': 'Отклонить',
		'cases.filters': '\u0424\u0438\u043b\u044c\u0442\u0440\u044b',
		'cases.telegram': 'Telegram Ads',
		'cases.google': 'Google Ads',
		'cases.meta': 'Meta Ads',
		'language.switcherLabel': 'Выбрать язык',
		'language.en': 'Английский',
		'language.ru': 'Русский',
		'language.ua': 'Украинский',
		'nav.home': 'Главная',
		'nav.about': 'О нас',
		'nav.cases': 'Кейсы',
		'nav.blog': 'Блог',
		'nav.contacts': 'Контакты',
		'nav.google': 'Google Ads',
		'nav.telegram': 'Telegram Ads',
		'nav.meta': 'Meta Ads',
		'nav.open': 'Открыть меню',
		'nav.close': 'Закрыть меню',
		'nav.main': 'Главное меню',
		'common.readMore': 'Читать далее',
		'common.seeMore': 'Подробнее',
		'common.message': 'Написать нам в Telegram',
		'common.previous': 'Предыдущая страница',
		'common.next': 'Следующая страница',
		'common.page': 'Страница',
		'hero.heading': 'Performance маркетинг',
		'hero.text': 'Мы не покупаем клики. Мы завоёвываем внимание.',
		'hero.next': 'Что мы делаем',
		'hero.telegramText':
			'Запускаем, оптимизируем и масштабируем официальную рекламу Telegram Ads с фокусом на бизнес-метрики: регистрации, активные депозиты и покупки.',
		'hero.metaText':
			'Создаём и масштабируем performance-кампании в Facebook и Instagram, оптимизируя каждый этап воронки по конверсиям, CPA и ROAS.',
		'hero.googleText':
			'Запускаем и масштабируем Google Ads с фокусом на лиды, покупки и рост выручки. Работаем на привлечение платящих клиентов, а не просто трафика.',
		'numbers.title': 'Цифры, за которыми мы стоим',
		'numbers.intro':
			'Каждая цифра отражает кампании, которые приносят реальные результаты.',
		'numbers.cost.title': 'Средняя стоимость пользователя',
		'numbers.cost.text':
			'Конкурентная стоимость пользователя благодаря правильной воронке и стратегии',
		'numbers.users.title': 'Пользователей из Telegram Ads',
		'numbers.users.text':
			'Стабильный поток новых пользователей из Telegram Ads для активных проектов каждый месяц',
		'numbers.clients.title': 'Активных клиентов',
		'numbers.clients.text':
			'Долгосрочные партнёрства с клиентами вместо разовых кампаний',
		'numbers.budget.title': 'Рекламного бюджета под управлением',
		'numbers.budget.text':
			'Управляем крупными бюджетами, сохраняя контроль эффективности',
		'cases.title': 'Кейсы и истории успеха',
		'cases.subtitle':
			'Примеры рекламных кампаний, которые мы запустили и масштабировали для клиентов',
		'cases.other': 'Другие проекты',
		'cases.catalog': 'Наши кейсы',
		'cases.search': 'Поиск...',
		'cases.empty': 'Кейсы не найдены',
		'cases.problem': 'Проблема:',
		'cases.fix': 'Наше решение:',
		'cases.work': 'Что сделали:',
		'cases.triumph': 'Результат:',
		'cases.results': 'Результаты',
		'cases.read': 'Читать кейс',
		'trust.title': 'Нам доверяют',
		'reviews.title': 'Отзывы',
		'talk.title': 'Готовы обсудить проект?',
		'about.title': 'О НАС',
		'about.pioneering': 'Развиваем цифровое пространство с 2024 года',
		'about.pioneeringText':
			'Мы — команда performance-маркетологов, стратегов и специалистов по росту. Анализируем продукты, тестируем гипотезы, запускаем кампании и оптимизируем их на основе данных. Каждое решение опирается на ROI, юнит-экономику и долгосрочную эффективность.',
		'about.core.title': 'КЛЮЧЕВАЯ ЭКСПЕРТИЗА',
		'about.core.text':
			'Помогаем брендам масштабировать рост через Telegram Ads, Meta Ads, Google Ads, influencer-маркетинг и конверсионные воронки',
		'about.philosophy.title': 'НАША ФИЛОСОФИЯ',
		'about.philosophy.text':
			'Игнорируем метрики тщеславия и фокусируемся на юнит-экономике. Строим автоматизированные системы привлечения с предсказуемым ростом выручки',
		'about.partnership.title': 'ПАРТНЁРСТВО В РОСТЕ',
		'about.partnership.text':
			'Работаем как продолжение вашей команды: предоставляем доступ к дашбордам, прозрачным рекламным кабинетам и прямой коммуникации',
		'about.niches.title': 'ЦЕЛЕВЫЕ НИШИ',
		'about.niches.text':
			'Работаем с Web3, gaming, iGaming и цифровыми продуктами, где успех измеряется пользователями, конверсиями и выручкой',
		'blog.title': 'Наш блог',
		'blog.empty': 'Пока нет опубликованных статей',
		'blog.subscribeTitle': 'Подпишитесь на рассылку с полезными материалами',
		'blog.subscribe': 'Подписаться',
		'blog.follow': 'Мы в соцсетях',
		'blog.keepExploring': 'Читайте дальше',
		'blog.recommended': 'Рекомендуемые статьи',
		'blog.readArticle': 'Читать статью',
		'blog.minRead': 'мин чтения',
		'blog.views': 'просмотров',
		'contact.title': 'Контакты',
		'contact.intro':
			'Есть проект или хотите масштабировать то, что уже работает? Выберите удобный канал — мы всегда на связи.',
		'contact.mark': 'Давайте расти вместе',
		'form.title': 'Давайте обсудим проект',
		'form.name': 'Имя',
		'form.method': 'Предпочтительный способ связи',
		'form.telegramUser': 'Имя пользователя Telegram',
		'form.details': 'Подробности',
		'form.submit': 'Начать',
		'form.close': 'Закрыть форму',
		'footer.text':
			'Performance-маркетинг для быстрорастущих брендов. Создаём и масштабируем системы привлечения с предсказуемым ROI в Telegram Ads, Meta, Google и других каналах.',
		'footer.navigation': 'Навигация',
		'footer.services': 'Услуги',
		'footer.legal': 'Документы',
		'footer.privacy': 'Политика конфиденциальности',
		'footer.terms': 'Условия использования',
		'footer.cookies': 'Политика cookie',
	},
	ua: {
		'consent.title': 'Аналітичні cookie',
		'consent.text':
			'Ми використовуємо аналітичні cookie, щоб розуміти джерела трафіку та покращувати сайт.',
		'consent.accept': 'Прийняти',
		'consent.reject': 'Відхилити',
		'cases.filters': '\u0424\u0456\u043b\u044c\u0442\u0440\u0438',
		'cases.telegram': 'Telegram Ads',
		'cases.google': 'Google Ads',
		'cases.meta': 'Meta Ads',
		'language.switcherLabel': 'Обрати мову',
		'language.en': 'Англійська',
		'language.ru': 'Російська',
		'language.ua': 'Українська',
		'nav.home': 'Головна',
		'nav.about': 'Про нас',
		'nav.cases': 'Кейси',
		'nav.blog': 'Блог',
		'nav.contacts': 'Контакти',
		'nav.google': 'Google Ads',
		'nav.telegram': 'Telegram Ads',
		'nav.meta': 'Meta Ads',
		'nav.open': 'Відкрити меню',
		'nav.close': 'Закрити меню',
		'nav.main': 'Головне меню',
		'common.readMore': 'Читати далі',
		'common.seeMore': 'Докладніше',
		'common.message': 'Написати нам у Telegram',
		'common.previous': 'Попередня сторінка',
		'common.next': 'Наступна сторінка',
		'common.page': 'Сторінка',
		'hero.heading': 'Performance маркетинг',
		'hero.text': 'Ми не купуємо кліки. Ми завойовуємо увагу.',
		'hero.next': 'Що ми робимо',
		'hero.telegramText':
			'Запускаємо, оптимізуємо й масштабуємо офіційну рекламу Telegram Ads із фокусом на бізнес-метрики: реєстрації, активні депозити та покупки.',
		'hero.metaText':
			'Створюємо й масштабуємо performance-кампанії у Facebook та Instagram, оптимізуючи кожен етап воронки за конверсіями, CPA і ROAS.',
		'hero.googleText':
			'Запускаємо й масштабуємо Google Ads із фокусом на ліди, покупки та зростання доходу. Працюємо на залучення платних клієнтів, а не просто трафіку.',
		'numbers.title': 'Цифри, за якими ми стоїмо',
		'numbers.intro':
			'Кожна цифра відображає кампанії, що приносять реальні результати.',
		'numbers.cost.title': 'Середня вартість користувача',
		'numbers.cost.text':
			'Конкурентна вартість користувача завдяки правильній воронці та стратегії',
		'numbers.users.title': 'Користувачів із Telegram Ads',
		'numbers.users.text':
			'Стабільний потік нових користувачів із Telegram Ads для активних проєктів щомісяця',
		'numbers.clients.title': 'Активних клієнтів',
		'numbers.clients.text':
			'Довгострокові партнерства з клієнтами замість одноразових кампаній',
		'numbers.budget.title': 'Рекламного бюджету під управлінням',
		'numbers.budget.text':
			'Керуємо великими бюджетами, зберігаючи контроль ефективності',
		'cases.title': 'Кейси та історії успіху',
		'cases.subtitle':
			'Приклади рекламних кампаній, які ми запустили й масштабували для клієнтів',
		'cases.other': 'Інші проєкти',
		'cases.catalog': 'Наші кейси',
		'cases.search': 'Пошук...',
		'cases.empty': 'Кейсів не знайдено',
		'cases.problem': 'Проблема:',
		'cases.fix': 'Наше рішення:',
		'cases.work': 'Що зробили:',
		'cases.triumph': 'Результат:',
		'cases.results': 'Результати',
		'cases.read': 'Читати кейс',
		'trust.title': 'Нам довіряють',
		'reviews.title': 'Відгуки',
		'talk.title': 'Готові обговорити проєкт?',
		'about.title': 'ПРО НАС',
		'about.pioneering': 'Розвиваємо цифровий простір із 2024 року',
		'about.pioneeringText':
			'Ми — команда performance-маркетологів, стратегів і фахівців зі зростання. Аналізуємо продукти, тестуємо гіпотези, запускаємо кампанії та оптимізуємо їх на основі даних. Кожне рішення спирається на ROI, юніт-економіку й довгострокову ефективність.',
		'about.core.title': 'КЛЮЧОВА ЕКСПЕРТИЗА',
		'about.core.text':
			'Допомагаємо брендам масштабувати зростання через Telegram Ads, Meta Ads, Google Ads, influencer-маркетинг і конверсійні воронки',
		'about.philosophy.title': 'НАША ФІЛОСОФІЯ',
		'about.philosophy.text':
			'Ігноруємо метрики марнославства та фокусуємося на юніт-економіці. Будуємо автоматизовані системи залучення з передбачуваним зростанням доходу',
		'about.partnership.title': 'ПАРТНЕРСТВО У ЗРОСТАННІ',
		'about.partnership.text':
			'Працюємо як продовження вашої команди: надаємо доступ до дашбордів, прозорих рекламних кабінетів і прямої комунікації',
		'about.niches.title': 'ЦІЛЬОВІ НІШІ',
		'about.niches.text':
			'Працюємо з Web3, gaming, iGaming і цифровими продуктами, де успіх вимірюється користувачами, конверсіями та доходом',
		'blog.title': 'Наш блог',
		'blog.empty': 'Поки немає опублікованих статей',
		'blog.subscribeTitle': 'Підпишіться на розсилку з корисними матеріалами',
		'blog.subscribe': 'Підписатися',
		'blog.follow': 'Ми в соцмережах',
		'blog.keepExploring': 'Читайте далі',
		'blog.recommended': 'Рекомендовані статті',
		'blog.readArticle': 'Читати статтю',
		'blog.minRead': 'хв читання',
		'blog.views': 'переглядів',
		'contact.title': 'Контакти',
		'contact.intro':
			'Маєте проєкт або хочете масштабувати те, що вже працює? Оберіть зручний канал — ми завжди на зв’язку.',
		'contact.mark': 'Зростаймо разом',
		'form.title': 'Обговорімо ваш проєкт',
		'form.name': 'Ім’я',
		'form.method': 'Бажаний спосіб зв’язку',
		'form.telegramUser': 'Ім’я користувача Telegram',
		'form.details': 'Деталі',
		'form.submit': 'Розпочати',
		'form.close': 'Закрити форму',
		'footer.text':
			'Performance-маркетинг для брендів, що швидко зростають. Створюємо й масштабуємо системи залучення з передбачуваним ROI у Telegram Ads, Meta, Google та інших каналах.',
		'footer.navigation': 'Навігація',
		'footer.services': 'Послуги',
		'footer.legal': 'Документи',
		'footer.privacy': 'Політика конфіденційності',
		'footer.terms': 'Умови використання',
		'footer.cookies': 'Політика cookie',
	},
};

export function hasLocale(value: string | null): value is Locale {
	return locales.some(locale => locale.code === value);
}

export function getLocaleMeta(locale: Locale) {
	return locales.find(item => item.code === locale) ?? locales[0];
}

export function translate(locale: Locale, key: TranslationKey) {
	return dictionaries[locale][key] ?? dictionaries.en[key];
}
