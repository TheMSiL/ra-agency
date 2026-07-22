import { readFile } from "node:fs/promises";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22" });

type Locale = "en" | "ru" | "ua";
type CaseCopy = {
	title: string;
	problem: string;
	fix: string;
	work: string;
	triumph: string;
};
type CaseSeed = {
	slug: string;
	company: string;
	channel: "telegram" | "google" | "meta";
	copy: Record<Locale, CaseCopy>;
};

const cases: CaseSeed[] = [
	{
		slug: "telegram-scale-01", company: "Nova Play", channel: "telegram",
		copy: {
			en: { title: "How We Rescued a Chronic CAC Problem: x3 Scale-Up", problem: "$9 CAC on broad settings", fix: "One campaign for each channel", work: "Tested 507 ads in two weeks", triumph: "1,019 users with $3 CAC" },
			ru: { title: "Как мы решили хроническую проблему CAC и выросли втрое", problem: "CAC $9 при широких настройках", fix: "Отдельная кампания для каждого канала", work: "Протестировали 507 объявлений за две недели", triumph: "1 019 пользователей с CAC $3" },
			ua: { title: "Як ми розв’язали хронічну проблему CAC і виросли втричі", problem: "CAC $9 за широких налаштувань", fix: "Окрема кампанія для кожного каналу", work: "Протестували 507 оголошень за два тижні", triumph: "1 019 користувачів із CAC $3" },
		},
	},
	{
		slug: "google-search-02", company: "FinEdge", channel: "google",
		copy: {
			en: { title: "Search Campaign Rebuild That Cut Wasted Spend", problem: "42% of the budget went to weak queries", fix: "Intent clusters and a clean negative list", work: "Rebuilt 18 ad groups in ten days", triumph: "31% lower CPA" },
			ru: { title: "Перестройка поисковых кампаний сократила лишние расходы", problem: "42% бюджета уходило на слабые запросы", fix: "Кластеры по намерению и чистый список минус-слов", work: "Перестроили 18 групп объявлений за десять дней", triumph: "CPA снизился на 31%" },
			ua: { title: "Перебудова пошукових кампаній скоротила зайві витрати", problem: "42% бюджету витрачалося на слабкі запити", fix: "Кластери за наміром і чистий список мінус-слів", work: "Перебудували 18 груп оголошень за десять днів", triumph: "CPA знизився на 31%" },
		},
	},
	{
		slug: "meta-creative-03", company: "FitCore", channel: "meta",
		copy: {
			en: { title: "Creative Testing System for Stable Meta ROAS", problem: "Creative fatigue after five to seven days", fix: "A weekly UGC testing pipeline", work: "Launched 64 creative angles", triumph: "2.8x ROAS for six weeks" },
			ru: { title: "Система тестирования креативов для стабильного Meta ROAS", problem: "Креативы выгорали через пять–семь дней", fix: "Еженедельный конвейер тестирования UGC", work: "Запустили 64 креативных подхода", triumph: "ROAS 2,8x в течение шести недель" },
			ua: { title: "Система тестування креативів для стабільного Meta ROAS", problem: "Креативи вигорали за п’ять–сім днів", fix: "Щотижневий конвеєр тестування UGC", work: "Запустили 64 креативні підходи", triumph: "ROAS 2,8x протягом шести тижнів" },
		},
	},
	{
		slug: "telegram-deposits-04", company: "Arcade Hub", channel: "telegram",
		copy: {
			en: { title: "Telegram Ads Funnel Focused on First Deposits", problem: "Registrations did not convert into deposits", fix: "Channel cohorts based on player intent", work: "Optimized 23 channel groups", triumph: "47% more first deposits" },
			ru: { title: "Воронка Telegram Ads с фокусом на первые депозиты", problem: "Регистрации не превращались в депозиты", fix: "Когорты каналов по намерениям игроков", work: "Оптимизировали 23 группы каналов", triumph: "На 47% больше первых депозитов" },
			ua: { title: "Воронка Telegram Ads із фокусом на перші депозити", problem: "Реєстрації не перетворювалися на депозити", fix: "Когорти каналів за намірами гравців", work: "Оптимізували 23 групи каналів", triumph: "На 47% більше перших депозитів" },
		},
	},
	{
		slug: "google-pmax-05", company: "Urban Gear", channel: "google",
		copy: {
			en: { title: "Performance Max Cleanup for Ecommerce Growth", problem: "ROAS remained below the target", fix: "Product feed split by margin and demand", work: "Segmented 1,240 products", triumph: "38% revenue growth" },
			ru: { title: "Оптимизация Performance Max для роста интернет-магазина", problem: "ROAS оставался ниже целевого значения", fix: "Разделение фида по марже и спросу", work: "Сегментировали 1 240 товаров", triumph: "Рост выручки на 38%" },
			ua: { title: "Оптимізація Performance Max для зростання інтернет-магазину", problem: "ROAS залишався нижчим за цільове значення", fix: "Розподіл фіда за маржею та попитом", work: "Сегментували 1 240 товарів", triumph: "Зростання виручки на 38%" },
		},
	},
];

const localeText = {
	en: {
		steps: ["Audit and diagnosis", "Strategy", "Implementation", "Testing and optimization", "Scaling the result"],
		descriptions: (copy: CaseCopy) => [
			`We audited the account, funnel, and analytics and confirmed the main constraint: ${copy.problem}.`,
			`We built a focused action plan around the core solution: ${copy.fix}.`,
			`The team rebuilt the setup and completed the main work: ${copy.work}.`,
			"We compared audience, placement, bidding, and creative combinations, then redirected budget toward statistically stronger variants.",
			`After stabilizing performance, we scaled the winning setup and achieved the final outcome: ${copy.triumph}.`,
		],
		results: ["Primary outcome", "Work completed", "Core approach"],
	},
	ru: {
		steps: ["Аудит и диагностика", "Стратегия", "Реализация", "Тестирование и оптимизация", "Масштабирование результата"],
		descriptions: (copy: CaseCopy) => [
			`Мы проверили аккаунт, воронку и аналитику и подтвердили главное ограничение: ${copy.problem}.`,
			`Построили сфокусированный план действий вокруг основного решения: ${copy.fix}.`,
			`Команда перестроила настройки и выполнила основную работу: ${copy.work}.`,
			"Сравнили аудитории, плейсменты, ставки и креативы, после чего перенаправили бюджет в статистически сильные комбинации.",
			`После стабилизации показателей масштабировали рабочую систему и получили итог: ${copy.triumph}.`,
		],
		results: ["Главный результат", "Выполненная работа", "Основной подход"],
	},
	ua: {
		steps: ["Аудит і діагностика", "Стратегія", "Реалізація", "Тестування й оптимізація", "Масштабування результату"],
		descriptions: (copy: CaseCopy) => [
			`Ми перевірили акаунт, воронку й аналітику та підтвердили головне обмеження: ${copy.problem}.`,
			`Побудували сфокусований план дій навколо основного рішення: ${copy.fix}.`,
			`Команда перебудувала налаштування й виконала основну роботу: ${copy.work}.`,
			"Порівняли аудиторії, плейсменти, ставки та креативи, після чого спрямували бюджет у статистично сильні комбінації.",
			`Після стабілізації показників масштабували робочу систему й отримали підсумок: ${copy.triumph}.`,
		],
		results: ["Головний результат", "Виконана робота", "Основний підхід"],
	},
} satisfies Record<Locale, {
	steps: string[];
	descriptions: (copy: CaseCopy) => string[];
	results: string[];
}>;

const key = () => crypto.randomUUID().replaceAll("-", "").slice(0, 12);

async function main() {
	const logo = await readFile("public/company_review.png");
	const asset = await client.assets.upload("image", logo, {
		filename: "case-study-company-logo.png",
		contentType: "image/png",
	});

	const languages: Locale[] = ["en", "ru", "ua"];
	const transaction = client.transaction();
	const now = Date.now();

	for (const [caseIndex, item] of cases.entries()) {
		for (const language of languages) {
			const copy = item.copy[language];
			const text = localeText[language];
			const descriptions = text.descriptions(copy);
			transaction.createOrReplace({
				_id: `test-case-${item.slug}-${language}`,
				_type: "caseStudy",
				language,
				title: copy.title,
				slug: { _type: "slug", current: item.slug },
				companyName: item.company,
				companyLogo: {
					_type: "image",
					asset: { _type: "reference", _ref: asset._id },
					alt: `${item.company} logo`,
				},
				channel: item.channel,
				problem: copy.problem,
				fix: copy.fix,
				work: copy.work,
				triumph: copy.triumph,
				steps: text.steps.map((title, index) => ({
					_type: "caseStep",
					_key: key(),
					title,
					description: descriptions[index],
				})),
				results: [copy.triumph, copy.work, copy.fix].map((value, index) => ({
					_type: "caseResult",
					_key: key(),
					title: text.results[index],
					value,
				})),
				status: "published",
				publishedAt: new Date(now - caseIndex * 86_400_000).toISOString(),
				isFeatured: caseIndex === 0,
				metaTitle: copy.title.slice(0, 60),
				metaDescription: `${copy.problem}. ${copy.triumph}.`.slice(0, 160),
				noindex: false,
			});
		}

		transaction.createOrReplace({
			_id: `translation.metadata.test-case-${item.slug}`,
			_type: "translation.metadata",
			schemaTypes: ["caseStudy"],
			translations: languages.map((language) => ({
				_type: "internationalizedArrayReferenceValue",
				_key: key(),
				language,
				value: { _type: "reference", _ref: `test-case-${item.slug}-${language}` },
			})),
		});
	}

	const result = await transaction.commit({ visibility: "sync" });
	console.log(`Created ${cases.length} complete case studies in ${languages.length} languages (${cases.length * languages.length} documents). Transaction: ${result.transactionId}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
