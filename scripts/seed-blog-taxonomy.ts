import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22" });

type LocalizedTitle = { en: string; ru: string; ua: string };

const categories: Array<{ slug: string; title: LocalizedTitle }> = [
	{ slug: "meal-planning", title: { en: "Meal planning", ru: "Планирование питания", ua: "Планування харчування" } },
	{ slug: "salads", title: { en: "Salads", ru: "Салаты", ua: "Салати" } },
	{ slug: "soups", title: { en: "Soups", ru: "Супы", ua: "Супи" } },
	{ slug: "healthy-snacks", title: { en: "Healthy snacks", ru: "Полезные перекусы", ua: "Корисні перекуси" } },
	{ slug: "family-dinners", title: { en: "Family dinners", ru: "Семейные ужины", ua: "Сімейні вечері" } },
];

const tags: Array<{ slug: string; title: LocalizedTitle }> = [
	{ slug: "quick-recipes", title: { en: "Quick recipes", ru: "Быстрые рецепты", ua: "Швидкі рецепти" } },
	{ slug: "healthy-eating", title: { en: "Healthy eating", ru: "Здоровое питание", ua: "Здорове харчування" } },
	{ slug: "vegetables", title: { en: "Vegetables", ru: "Овощи", ua: "Овочі" } },
	{ slug: "meal-prep", title: { en: "Meal prep", ru: "Заготовки еды", ua: "Заготовки їжі" } },
	{ slug: "budget-friendly", title: { en: "Budget friendly", ru: "Бюджетно", ua: "Бюджетно" } },
	{ slug: "vegetarian", title: { en: "Vegetarian", ru: "Вегетарианское", ua: "Вегетаріанське" } },
	{ slug: "lunch", title: { en: "Lunch", ru: "Обед", ua: "Обід" } },
	{ slug: "dinner", title: { en: "Dinner", ru: "Ужин", ua: "Вечеря" } },
	{ slug: "family-food", title: { en: "Family food", ru: "Для всей семьи", ua: "Для всієї родини" } },
	{ slug: "make-ahead", title: { en: "Make ahead", ru: "Готовим заранее", ua: "Готуємо заздалегідь" } },
];

const assignments: Record<string, { category: string; tags: string[] }> = {
	"meal-prep-for-busy-week": {
		category: "meal-planning",
		tags: ["meal-prep", "make-ahead", "healthy-eating", "budget-friendly"],
	},
	"mediterranean-salad-at-home": {
		category: "salads",
		tags: ["vegetables", "vegetarian", "healthy-eating", "lunch"],
	},
	"creamy-vegetable-soup": {
		category: "soups",
		tags: ["vegetables", "vegetarian", "budget-friendly", "dinner"],
	},
	"healthy-snacks-for-work": {
		category: "healthy-snacks",
		tags: ["healthy-eating", "quick-recipes", "make-ahead", "lunch"],
	},
	"quick-family-dinner": {
		category: "family-dinners",
		tags: ["quick-recipes", "dinner", "family-food", "budget-friendly"],
	},
};

const reference = (id: string, key?: string) => ({
	_type: "reference",
	_ref: id,
	...(key ? { _key: key } : {}),
});

async function main() {
	const transaction = client.transaction();

	for (const category of categories) {
		transaction.createOrReplace({
			_id: `test-category-${category.slug}`,
			_type: "category",
			title: category.title,
			slug: { _type: "slug", current: category.slug },
		});
	}

	for (const tag of tags) {
		transaction.createOrReplace({
			_id: `test-tag-${tag.slug}`,
			_type: "tag",
			title: tag.title,
			slug: { _type: "slug", current: tag.slug },
		});
	}

	for (const [articleSlug, assignment] of Object.entries(assignments)) {
		for (const language of ["en", "ru", "ua"]) {
			transaction.patch(`test-${articleSlug}-${language}`, (patch) =>
				patch.set({
					category: reference(`test-category-${assignment.category}`),
					tags: assignment.tags.map((tag, index) =>
						reference(`test-tag-${tag}`, `${articleSlug}-${index}`),
					),
				}),
			);
		}
	}

	const result = await transaction.commit({ visibility: "sync" });
	console.log(
		`Created ${categories.length} categories and ${tags.length} tags; updated ${Object.keys(assignments).length * 3} article documents. Transaction: ${result.transactionId}`,
	);

	const assignedArticles = await client.fetch<
		Array<{ slug: string; category: string; tags: string[] }>
	>(
		`*[_type == "article" && language == "en" && _id match "test-*"] | order(slug.current) {
			"slug": slug.current,
			"category": category->title.en,
			"tags": tags[]->title.en
		}`,
	);
	console.log(JSON.stringify(assignedArticles, null, 2));
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
