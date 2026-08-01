import { article } from "./article";
import { author } from "./author";
import { category } from "./category";
import { caseStudy } from "./caseStudy";
import { localizedString } from "./localizedString";
import { localizedText } from "./localizedText";
import { newsletterDelivery } from "./newsletterDelivery";
import { newsletterSubscriber } from "./newsletterSubscriber";
import { review } from "./review";
import { tag } from "./tag";
import { trustedCompany } from "./trustedCompany";
import { lead } from "./lead";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [localizedString, localizedText, category, tag, author, article, caseStudy, trustedCompany, review, siteSettings, lead, newsletterSubscriber, newsletterDelivery];
