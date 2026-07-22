import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22" });

type Locale = "en" | "ru" | "ua";
type Copy = { title: string; excerpt: string; intro: string; heading: string; tips: string[]; closing: string };
type Topic = { slug: string; readTime: number; copy: Record<Locale, Copy> };

const topics: Topic[] = [
	{
		slug: "meal-prep-for-busy-week",
		readTime: 5,
		copy: {
			en: { title: "Meal prep for a busy week", excerpt: "A practical plan for preparing balanced meals in advance, saving time on weekdays, and keeping everyday nutrition simple and varied.", intro: "Meal prep does not mean eating the same dish all week. A flexible base of grains, vegetables, protein, and sauces makes dozens of combinations possible.", heading: "A simple preparation plan", tips: ["Choose two protein sources", "Prepare one grain and several vegetables", "Store sauces separately", "Label containers with dates"], closing: "Start with three days instead of seven. A smaller plan is easier to maintain and adjust to your real schedule." },
			ru: { title: "Заготовки еды на занятую неделю", excerpt: "Практичный план сбалансированных заготовок, который экономит время в будни и помогает сделать ежедневное питание простым и разнообразным.", intro: "Заготовки не означают, что всю неделю нужно есть одно блюдо. База из круп, овощей, белка и соусов позволяет собирать разные комбинации.", heading: "Простой план подготовки", tips: ["Выберите два источника белка", "Приготовьте одну крупу и несколько овощей", "Храните соусы отдельно", "Подпишите контейнеры датами"], closing: "Начните с трёх дней, а не с семи. Небольшой план проще поддерживать и адаптировать под реальный график." },
			ua: { title: "Заготовки їжі на зайнятий тиждень", excerpt: "Практичний план збалансованих заготовок, що заощаджує час у будні та допомагає зробити щоденне харчування простим і різноманітним.", intro: "Заготовки не означають, що весь тиждень треба їсти одну страву. База з круп, овочів, білка й соусів дає змогу складати різні комбінації.", heading: "Простий план підготовки", tips: ["Оберіть два джерела білка", "Приготуйте одну крупу та кілька овочів", "Зберігайте соуси окремо", "Підпишіть контейнери датами"], closing: "Почніть із трьох днів, а не із семи. Невеликий план простіше підтримувати й адаптувати до реального графіка." },
		},
	},
	{
		slug: "mediterranean-salad-at-home", readTime: 4,
		copy: {
			en: { title: "A Mediterranean salad at home", excerpt: "Fresh vegetables, herbs, cheese, and a bright dressing come together in a quick Mediterranean-style salad suitable for lunch or dinner.", intro: "The strength of this salad is contrast: crisp vegetables, salty cheese, aromatic herbs, and a dressing with noticeable acidity.", heading: "How to balance the flavors", tips: ["Use ripe seasonal vegetables", "Add herbs just before serving", "Mix the dressing separately", "Salt the salad at the end"], closing: "Serve immediately with toasted bread or add chickpeas to turn the salad into a complete meal." },
			ru: { title: "Средиземноморский салат дома", excerpt: "Свежие овощи, зелень, сыр и яркая заправка соединяются в быстром средиземноморском салате, подходящем для обеда или ужина.", intro: "Сила этого салата — в контрасте: хрустящие овощи, солоноватый сыр, ароматная зелень и заправка с заметной кислинкой.", heading: "Как сбалансировать вкус", tips: ["Используйте спелые сезонные овощи", "Добавляйте зелень перед подачей", "Смешивайте заправку отдельно", "Солите салат в самом конце"], closing: "Подавайте сразу с подсушенным хлебом или добавьте нут, чтобы превратить салат в полноценный приём пищи." },
			ua: { title: "Середземноморський салат удома", excerpt: "Свіжі овочі, зелень, сир і яскрава заправка поєднуються у швидкому середземноморському салаті для обіду або вечері.", intro: "Сила цього салату — у контрасті: хрумкі овочі, солонуватий сир, ароматна зелень і заправка з помітною кислинкою.", heading: "Як збалансувати смак", tips: ["Використовуйте стиглі сезонні овочі", "Додавайте зелень перед подаванням", "Змішуйте заправку окремо", "Соліть салат наприкінці"], closing: "Подавайте одразу з підсмаженим хлібом або додайте нут, щоб перетворити салат на повноцінний прийом їжі." },
		},
	},
	{
		slug: "creamy-vegetable-soup", readTime: 6,
		copy: {
			en: { title: "Creamy vegetable soup without cream", excerpt: "Learn how to make a smooth, satisfying vegetable soup without heavy cream by using roasted vegetables and the right blending technique.", intro: "A silky texture can come entirely from vegetables. Roasting deepens their flavor, while potatoes or white beans give the soup body.", heading: "The texture matters", tips: ["Roast vegetables until golden", "Add stock gradually", "Blend while the soup is hot", "Finish with lemon juice"], closing: "Top each bowl with seeds, herbs, or crispy chickpeas for extra texture and a more complete meal." },
			ru: { title: "Овощной крем-суп без сливок", excerpt: "Готовим гладкий и сытный овощной суп без жирных сливок, используя запечённые овощи и правильную технику измельчения.", intro: "Шелковистую текстуру можно получить только из овощей. Запекание усиливает вкус, а картофель или белая фасоль придают супу плотность.", heading: "Текстура имеет значение", tips: ["Запекайте овощи до золотистого цвета", "Добавляйте бульон постепенно", "Измельчайте суп горячим", "Завершите вкус лимонным соком"], closing: "Добавьте в тарелку семена, зелень или хрустящий нут — так появится дополнительная текстура и сытность." },
			ua: { title: "Овочевий крем-суп без вершків", excerpt: "Готуємо гладкий і ситний овочевий суп без жирних вершків, використовуючи запечені овочі та правильну техніку подрібнення.", intro: "Шовковисту текстуру можна отримати лише з овочів. Запікання підсилює смак, а картопля чи біла квасоля надають супу густоти.", heading: "Текстура має значення", tips: ["Запікайте овочі до золотавого кольору", "Додавайте бульйон поступово", "Подрібнюйте суп гарячим", "Завершіть смак лимонним соком"], closing: "Додайте до тарілки насіння, зелень або хрумкий нут — так з’явиться додаткова текстура й ситність." },
		},
	},
	{
		slug: "healthy-snacks-for-work", readTime: 4,
		copy: {
			en: { title: "Healthy snacks for the workday", excerpt: "Five simple snack combinations that travel well, require little preparation, and help maintain steady energy throughout a busy workday.", intro: "A useful snack combines protein, fiber, and a small amount of fat. This keeps hunger under control better than sweets or pastries alone.", heading: "Five reliable combinations", tips: ["Apple with nut butter", "Yogurt with berries", "Hummus with vegetables", "Cheese with whole-grain crackers"], closing: "Prepare portions in advance so the convenient choice is also the balanced one when the day becomes busy." },
			ru: { title: "Полезные перекусы для рабочего дня", excerpt: "Пять простых вариантов перекуса, которые удобно брать с собой, легко готовить и использовать для поддержания энергии в течение дня.", intro: "Полезный перекус сочетает белок, клетчатку и небольшое количество жира. Такая комбинация контролирует голод лучше, чем одни сладости или выпечка.", heading: "Пять надёжных сочетаний", tips: ["Яблоко с ореховой пастой", "Йогурт с ягодами", "Хумус с овощами", "Сыр с цельнозерновыми крекерами"], closing: "Подготовьте порции заранее, чтобы в загруженный день самый удобный вариант одновременно оказался сбалансированным." },
			ua: { title: "Корисні перекуси для робочого дня", excerpt: "П’ять простих варіантів перекусу, які зручно брати із собою, легко готувати й використовувати для підтримання енергії протягом дня.", intro: "Корисний перекус поєднує білок, клітковину та невелику кількість жиру. Така комбінація контролює голод краще, ніж лише солодощі чи випічка.", heading: "П’ять надійних поєднань", tips: ["Яблуко з горіховою пастою", "Йогурт із ягодами", "Хумус з овочами", "Сир із цільнозерновими крекерами"], closing: "Підготуйте порції заздалегідь, щоб у завантажений день найзручніший варіант водночас був збалансованим." },
		},
	},
	{
		slug: "quick-family-dinner", readTime: 5,
		copy: {
			en: { title: "A quick family dinner in one pan", excerpt: "A flexible one-pan dinner with vegetables and protein that minimizes washing up and can be adapted to ingredients already in your kitchen.", intro: "One-pan meals work because all ingredients share flavor while cooking. The key is cutting everything to sizes that finish at the same time.", heading: "Build the dish in layers", tips: ["Start with firm vegetables", "Season every layer", "Add delicate vegetables later", "Rest the dish before serving"], closing: "Change the protein, vegetables, and spices each week while keeping the same basic method for an easy dinner routine." },
			ru: { title: "Быстрый семейный ужин на одном противне", excerpt: "Гибкий ужин из овощей и белка на одном противне: минимум посуды и возможность использовать продукты, которые уже есть на кухне.", intro: "Блюда на одном противне удобны тем, что ингредиенты обмениваются вкусами во время приготовления. Главное — нарезать их так, чтобы они приготовились одновременно.", heading: "Собирайте блюдо слоями", tips: ["Начните с плотных овощей", "Приправляйте каждый слой", "Нежные овощи добавляйте позже", "Дайте блюду отдохнуть перед подачей"], closing: "Меняйте белок, овощи и специи каждую неделю, сохраняя базовый метод для простого семейного ужина." },
			ua: { title: "Швидка сімейна вечеря на одному деку", excerpt: "Гнучка вечеря з овочів і білка на одному деку: мінімум посуду та можливість використати продукти, які вже є на кухні.", intro: "Страви на одному деку зручні тим, що інгредієнти обмінюються смаками під час приготування. Головне — нарізати їх так, щоб вони приготувалися одночасно.", heading: "Складайте страву шарами", tips: ["Почніть зі щільних овочів", "Приправляйте кожен шар", "Ніжні овочі додавайте пізніше", "Дайте страві відпочити перед подаванням"], closing: "Змінюйте білок, овочі та спеції щотижня, зберігаючи базовий метод для простої сімейної вечері." },
		},
	},
];

const key = () => crypto.randomUUID().replaceAll("-", "").slice(0, 12);
const block = (style: "normal" | "h2", text: string) => ({
	_type: "block", _key: key(), style, markDefs: [], children: [{ _type: "span", _key: key(), marks: [], text }],
});
const listBlocks = (items: string[]) => items.map((text) => ({ ...block("normal", text), listItem: "bullet", level: 1 }));

async function main() {
const base = await client.fetch(`*[_type == "article" && language == "en" && defined(coverImage.asset)][0]{coverImage, category, author, tags}`);
if (!base?.coverImage?.asset?._ref || !base.category?._ref || !base.author?._ref) {
	throw new Error("Create one complete article with a cover, category, and author before running this seed");
}

const locales: Locale[] = ["en", "ru", "ua"];
const now = new Date();
const transaction = client.transaction();

topics.forEach((topic, topicIndex) => {
	locales.forEach((language) => {
		const copy = topic.copy[language];
		const id = `test-${topic.slug}-${language}`;
		const nextId = `test-${topics[(topicIndex + 1) % topics.length].slug}-${language}`;
		transaction.createOrReplace({
			_id: id,
			_type: "article",
			language,
			title: copy.title,
			slug: { _type: "slug", current: topic.slug },
			excerpt: copy.excerpt,
			coverImage: { ...base.coverImage, alt: language === "en" ? "Fresh ingredients for a healthy meal" : language === "ru" ? "Свежие продукты для полезного блюда" : "Свіжі продукти для корисної страви" },
			category: base.category,
			tags: base.tags ?? [],
			author: base.author,
			body: [block("normal", copy.intro), block("h2", copy.heading), ...listBlocks(copy.tips), block("normal", copy.closing)],
			relatedArticles: [{ _type: "reference", _key: key(), _ref: nextId }],
			status: "published",
			publishedAt: new Date(now.getTime() - (topicIndex + 1) * 86_400_000).toISOString(),
			readTime: topic.readTime,
			views: 24 + topicIndex * 17,
			isFeatured: false,
			noindex: false,
		});
	});

	transaction.createOrReplace({
		_id: `translation.metadata.test-${topic.slug}`,
		_type: "translation.metadata",
		schemaTypes: ["article"],
		translations: locales.map((language) => ({
			_type: "internationalizedArrayReferenceValue",
			_key: key(),
			language,
			value: { _type: "reference", _ref: `test-${topic.slug}-${language}` },
		})),
	});
});

const result = await transaction.commit({ visibility: "sync" });
console.log(`Created or updated ${topics.length} multilingual articles (${topics.length * locales.length} documents). Transaction: ${result.transactionId}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
