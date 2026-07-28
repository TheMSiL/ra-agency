# Настройка рассылки

На сайте подписки работают через два сервиса:

- **Sanity** хранит подписчиков и историю отправок;
- **Resend** хранит контакты и отправляет письма.

Для английской, русской и украинской версий используются отдельные сегменты
Resend. Благодаря этому подписчик получает статьи только на выбранном языке.

## Что понадобится

- доступ к проекту **Resend**;
- доступ к проекту **Sanity**;
- доступ к настройкам проекта на **Vercel**;
- домен `raagency.tech` и доступ к его DNS-записям.

Секретные ключи нельзя добавлять в Git или вставлять в клиентский код. Их нужно
хранить только в переменных окружения Vercel и, при локальной разработке, в
файле `.env.local`.

## Шаг 1. Подтвердить домен в Resend

1. Зайти на [resend.com](https://resend.com/) и открыть нужный проект.
2. В левом меню открыть **Domains**.
3. Нажать **Add Domain** и добавить `raagency.tech`.
4. Resend покажет DNS-записи, которые нужно создать у регистратора домена или
   в панели управления DNS.
5. Добавить все показанные записи.
6. Вернуться в Resend → **Domains** и дождаться статуса **Verified**.

Адрес отправителя в проекте:

```text
RA Agency <newsletter@raagency.tech>
```

Он заработает только после подтверждения домена.

## Шаг 2. Создать три сегмента в Resend

1. В Resend открыть раздел **Contacts** → **Segments**.
2. Создать три сегмента:
   - `English`;
   - `Russian`;
   - `Ukrainian`.
3. Открыть каждый сегмент и скопировать его ID из страницы сегмента или URL.
4. Сохранить соответствие:

```env
RESEND_NEWSLETTER_SEGMENT_ID_EN=ID_сегмента_English
RESEND_NEWSLETTER_SEGMENT_ID_RU=ID_сегмента_Russian
RESEND_NEWSLETTER_SEGMENT_ID_UA=ID_сегмента_Ukrainian
```

Не путать ID сегмента с его названием.

## Шаг 3. Создать API-ключ Resend

1. В Resend открыть **API Keys**.
2. Нажать **Create API Key**.
3. Назвать ключ, например `RA Agency Production`.
4. Выдать ключу доступ, необходимый для **Contacts** и **Broadcasts**.
5. Скопировать ключ сразу после создания. Повторно полностью посмотреть его
   обычно нельзя.

Получится значение вида:

```env
RESEND_API_KEY=re_...
```

## Шаг 4. Создать токен Sanity

1. Открыть [sanity.io/manage](https://www.sanity.io/manage).
2. Выбрать проект RA Agency.
3. Открыть **API** → **Tokens**.
4. Нажать **Add API token**.
5. Назвать токен, например `RA Agency Newsletter Production`.
6. Выбрать права **Editor**. Токен должен уметь создавать и изменять документы
   `newsletterSubscriber` и `newsletterDelivery`.
7. Скопировать токен.

Полученное значение:

```env
SANITY_API_WRITE_TOKEN=...
```

## Шаг 5. Добавить переменные окружения в Vercel

1. Открыть проект сайта в [vercel.com](https://vercel.com/).
2. Перейти в **Settings** → **Environment Variables**.
3. Добавить все переменные ниже для окружения **Production**:

```env
RESEND_API_KEY=re_...
RESEND_NEWSLETTER_SEGMENT_ID_EN=...
RESEND_NEWSLETTER_SEGMENT_ID_RU=...
RESEND_NEWSLETTER_SEGMENT_ID_UA=...
RESEND_FROM_EMAIL="RA Agency <newsletter@raagency.tech>"
NEXT_PUBLIC_SITE_URL=https://raagency.tech
SANITY_API_WRITE_TOKEN=...
```

Переменную `SANITY_WEBHOOK_SECRET` добавим на следующем шаге.

После добавления или изменения переменных нужно выполнить новый **Deploy**.
Старый уже запущенный deployment новые значения не получит.

## Шаг 6. Создать секрет для webhook

Сгенерировать длинную случайную строку. Это будет общий секрет между Sanity и
сайтом. Например, можно использовать менеджер паролей и создать пароль длиной
не менее 32 символов.

1. В Vercel добавить переменную:

```env
SANITY_WEBHOOK_SECRET=ваша_длинная_случайная_строка
```

2. Сохранить эту строку — точно такое же значение понадобится в Sanity.
3. Никому не отправлять секрет и не добавлять его в репозиторий.

## Шаг 7. Создать webhook в Sanity

1. Открыть [sanity.io/manage](https://www.sanity.io/manage).
2. Выбрать проект RA Agency.
3. Открыть **API** → **Webhooks**.
4. Нажать **Create webhook**.
5. Заполнить настройки:

   - **Name:** `Newsletter — article published`;
   - **URL:** `https://raagency.tech/api/newsletter/article-published`;
   - **Dataset:** `production`;
   - **Trigger on:** `Create` и `Update`;
   - **Include drafts:** выключено;
   - **Secret:** значение `SANITY_WEBHOOK_SECRET` из Vercel.

6. В поле **Filter** вставить:

```groq
_type == "article" && status in ["published", "scheduled"]
```

7. В поле **Projection** вставить:

```groq
{_id, title, excerpt, language, status, publishedAt, "slug": slug.current}
```

8. Сохранить webhook.

Важно: секрет в Sanity и `SANITY_WEBHOOK_SECRET` в Vercel должны полностью
совпадать, включая регистр символов.

## Шаг 8. Перед проверкой сделать новый deployment

После того как все переменные добавлены:

1. В Vercel открыть вкладку **Deployments**.
2. Открыть меню последнего production deployment.
3. Нажать **Redeploy**.
4. Дождаться статуса **Ready**.

## Шаг 9. Проверить подписку

Проверять лучше на трёх разных email-адресах:

1. Открыть английскую версию сайта и подписаться.
2. Открыть русскую версию и подписаться другим адресом.
3. Открыть украинскую версию и подписаться третьим адресом.
4. В Sanity Studio открыть:
   - **Newsletter subscribers** — подписчики должны появиться здесь;
   - у каждого подписчика поле синхронизации должно показывать успешный статус.
5. В Resend открыть **Contacts** и убедиться, что каждый адрес добавлен в
   правильный языковой сегмент.

Если подписчик появился в Sanity, но не появился в Resend, проверить:

- `RESEND_API_KEY`;
- ID всех трёх сегментов;
- права API-ключа Resend;
- логи функции `/api/newsletter/subscribe` в Vercel.

## Шаг 10. Проверить отправку статьи

Сначала использовать тестовую статью, а не настоящую публикацию:

1. Создать в Sanity Studio тестовую статью.
2. Проверить, что заполнены:
   - заголовок;
   - slug;
   - язык;
   - краткое описание;
   - статус;
   - дата публикации.
3. Установить статус `published` для немедленной отправки или `scheduled` для
   запланированной.
4. Сохранить/опубликовать документ.
5. В Sanity Studio открыть **Newsletter deliveries**.
6. Проверить статус отправки:
   - `sent` — письмо отправлено;
   - `scheduled` — письмо запланировано;
   - `failed` — произошла ошибка, её текст должен быть записан в документе.
7. В Resend открыть **Broadcasts** и проверить созданную рассылку.
8. Убедиться, что письмо пришло тестовому подписчику нужного языка и ссылка
   ведёт на правильную статью.

Повторное обновление одной и той же статьи не должно отправлять письмо второй
раз: сайт создаёт для статьи отдельную запись доставки и проверяет её статус.

## Итоговый список переменных

В production-окружении Vercel должны быть заполнены:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=...
SANITY_WEBHOOK_SECRET=...

RESEND_API_KEY=re_...
RESEND_NEWSLETTER_SEGMENT_ID_EN=...
RESEND_NEWSLETTER_SEGMENT_ID_RU=...
RESEND_NEWSLETTER_SEGMENT_ID_UA=...
RESEND_FROM_EMAIL="RA Agency <newsletter@raagency.tech>"

NEXT_PUBLIC_SITE_URL=https://raagency.tech
```

`SANITY_API_READ_TOKEN` к самой рассылке не относится, но может требоваться
другим функциям сайта.
