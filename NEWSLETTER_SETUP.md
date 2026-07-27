# Newsletter setup

The site stores every subscription in Sanity and mirrors active subscribers to
Resend. Each language has its own Resend Segment, so subscribers only receive
articles in the language they selected on the site.

## 1. Resend

1. Verify the sending domain in Resend.
2. Create three Segments: English, Russian, and Ukrainian.
3. Create an API key with access to Contacts and Broadcasts.
4. Add the following production environment variables:

```env
RESEND_API_KEY=re_...
RESEND_NEWSLETTER_SEGMENT_ID_EN=...
RESEND_NEWSLETTER_SEGMENT_ID_RU=...
RESEND_NEWSLETTER_SEGMENT_ID_UA=...
RESEND_FROM_EMAIL="RA Agency <newsletter@raagency.tech>"
NEXT_PUBLIC_SITE_URL=https://raagency.tech
```

## 2. Sanity webhook

Create a document webhook in the Sanity project:

- URL: `https://raagency.tech/api/newsletter/article-published`
- Trigger: Create and Update
- Dataset: the production dataset
- Filter:

```groq
_type == "article" && status in ["published", "scheduled"]
```

- Projection:

```groq
{_id, title, excerpt, language, status, publishedAt, "slug": slug.current}
```

- Include drafts: off
- Secret: a new random value, also stored as `SANITY_WEBHOOK_SECRET` in the
  production environment.

The endpoint records a deterministic delivery document for every article, so
repeated article updates do not send the same newsletter twice. Scheduled
articles create a scheduled Resend Broadcast for `publishedAt`.

## 3. Required Sanity variables

```env
SANITY_API_WRITE_TOKEN=...
SANITY_WEBHOOK_SECRET=...
```

The token must be able to create and update `newsletterSubscriber` and
`newsletterDelivery` documents.

After deployment, test with one address in each language before publishing the
first production article. In Sanity Studio, use **Newsletter subscribers** to
see signups and **Newsletter deliveries** to inspect sent, scheduled, or failed
broadcasts.
